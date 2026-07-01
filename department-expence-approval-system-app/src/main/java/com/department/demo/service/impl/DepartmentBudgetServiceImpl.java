package com.department.demo.service.impl;

import com.department.demo.dto.DepartmentBudgetRequestDTO;
import com.department.demo.dto.DepartmentBudgetResponseDTO;
import com.department.demo.entity.Department;
import com.department.demo.entity.DepartmentBudget;
import com.department.demo.exception.BadRequestException;
import com.department.demo.exception.DuplicateResourceException;
import com.department.demo.exception.ResourceNotFoundException;
import com.department.demo.enums.ClaimStatus;
import com.department.demo.repository.DepartmentBudgetRepository;
import com.department.demo.repository.DepartmentRepository;
import com.department.demo.repository.ExpenseClaimRepository;
import com.department.demo.service.DepartmentBudgetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DepartmentBudgetServiceImpl implements DepartmentBudgetService {

    private final DepartmentBudgetRepository budgetRepository;
    private final DepartmentRepository departmentRepository;
    private final ExpenseClaimRepository claimRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public DepartmentBudgetResponseDTO createBudget(DepartmentBudgetRequestDTO requestDTO) {
        Department department = departmentRepository.findById(requestDTO.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + requestDTO.getDepartmentId()));

        if (budgetRepository.existsByDepartmentIdAndMonthAndYear(requestDTO.getDepartmentId(), requestDTO.getMonth(), requestDTO.getYear())) {
            throw new DuplicateResourceException(
                    String.format("Budget already exists for department ID %d for %s %d",
                            requestDTO.getDepartmentId(), requestDTO.getMonth(), requestDTO.getYear()));
        }

        DepartmentBudget budget = DepartmentBudget.builder()
                .department(department)
                .month(requestDTO.getMonth())
                .year(requestDTO.getYear())
                .budgetAmount(requestDTO.getBudgetAmount())
                .build();

        DepartmentBudget savedBudget = budgetRepository.save(budget);
        log.info("Department Budget Created with ID: {}", savedBudget.getId());

        return modelMapper.map(savedBudget, DepartmentBudgetResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentBudgetResponseDTO> getAllBudgets() {
        return budgetRepository.findAll().stream()
                .map(budget -> modelMapper.map(budget, DepartmentBudgetResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentBudgetResponseDTO getBudgetById(Long id) {
        DepartmentBudget budget = findBudgetById(id);
        return modelMapper.map(budget, DepartmentBudgetResponseDTO.class);
    }

    @Override
    @Transactional
    public DepartmentBudgetResponseDTO updateBudget(Long id, DepartmentBudgetRequestDTO requestDTO) {
        DepartmentBudget budget = findBudgetById(id);

        if (!budget.getDepartment().getId().equals(requestDTO.getDepartmentId()) ||
            !budget.getMonth().equals(requestDTO.getMonth()) ||
            !budget.getYear().equals(requestDTO.getYear())) {
            throw new BadRequestException("Department, Month, and Year cannot be changed during an update. Only Budget Amount may change.");
        }

        BigDecimal totalApproved = claimRepository.calculateTotalApprovedAmount(
                budget.getDepartment().getId(),
                ClaimStatus.APPROVED,
                budget.getMonth().getValue(),
                budget.getYear()
        );

        if (requestDTO.getBudgetAmount().compareTo(totalApproved) < 0) {
            throw new BadRequestException("New budget amount cannot be less than already approved claims total of " + totalApproved);
        }

        budget.setBudgetAmount(requestDTO.getBudgetAmount());
        DepartmentBudget updatedBudget = budgetRepository.save(budget);
        log.info("Department Budget Updated with ID: {}", updatedBudget.getId());

        return modelMapper.map(updatedBudget, DepartmentBudgetResponseDTO.class);
    }

    @Override
    @Transactional
    public void deleteBudget(Long id) {
        DepartmentBudget budget = findBudgetById(id);

        long claimCount = claimRepository.countByDepartmentIdAndMonthAndYear(
                budget.getDepartment().getId(),
                budget.getMonth().getValue(),
                budget.getYear()
        );

        if (claimCount > 0) {
            throw new BadRequestException("Cannot delete budget because expense claims exist for this month.");
        }

        budgetRepository.delete(budget);
        log.info("Department Budget Deleted with ID: {}", id);
    }

    private DepartmentBudget findBudgetById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department Budget not found with ID: " + id));
    }
}
