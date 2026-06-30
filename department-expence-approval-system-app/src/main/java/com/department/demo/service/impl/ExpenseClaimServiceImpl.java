package com.department.demo.service.impl;

import com.department.demo.dto.ExpenseClaimRequestDTO;
import com.department.demo.dto.ExpenseClaimResponseDTO;
import com.department.demo.entity.Department;
import com.department.demo.entity.ExpenseClaim;
import com.department.demo.enums.ClaimStatus;
import com.department.demo.enums.ExpenseCategory;
import com.department.demo.exception.BadRequestException;
import com.department.demo.exception.ResourceNotFoundException;
import com.department.demo.repository.DepartmentRepository;
import com.department.demo.repository.ExpenseClaimRepository;
import com.department.demo.repository.ExpenseClaimSpecification;
import com.department.demo.service.ExpenseClaimService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExpenseClaimServiceImpl implements ExpenseClaimService {

    private final ExpenseClaimRepository claimRepository;
    private final DepartmentRepository departmentRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public ExpenseClaimResponseDTO createClaim(ExpenseClaimRequestDTO requestDTO) {
        Department department = departmentRepository.findById(requestDTO.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + requestDTO.getDepartmentId()));

        ExpenseClaim claim = ExpenseClaim.builder()
                .employeeName(requestDTO.getEmployeeName())
                .department(department)
                .expenseCategory(requestDTO.getExpenseCategory())
                .amount(requestDTO.getAmount())
                .expenseDate(requestDTO.getExpenseDate())
                .description(requestDTO.getDescription())
                .status(ClaimStatus.PENDING)
                .build();

        ExpenseClaim savedClaim = claimRepository.save(claim);
        log.info("Expense Claim Created with ID: {}", savedClaim.getId());

        return modelMapper.map(savedClaim, ExpenseClaimResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseClaimResponseDTO getClaimById(Long id) {
        ExpenseClaim claim = findClaimById(id);
        return modelMapper.map(claim, ExpenseClaimResponseDTO.class);
    }

    @Override
    @Transactional
    public ExpenseClaimResponseDTO updateClaim(Long id, ExpenseClaimRequestDTO requestDTO) {
        ExpenseClaim claim = findClaimById(id);

        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new BadRequestException("Cannot Edit Approved or Rejected Claim. Claim is in status: " + claim.getStatus());
        }

        Department department = departmentRepository.findById(requestDTO.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + requestDTO.getDepartmentId()));

        claim.setEmployeeName(requestDTO.getEmployeeName());
        claim.setDepartment(department);
        claim.setExpenseCategory(requestDTO.getExpenseCategory());
        claim.setAmount(requestDTO.getAmount());
        claim.setExpenseDate(requestDTO.getExpenseDate());
        claim.setDescription(requestDTO.getDescription());

        // Note: We deliberately DO NOT update status or review remarks here.

        ExpenseClaim updatedClaim = claimRepository.save(claim);
        log.info("Expense Claim Updated with ID: {}", updatedClaim.getId());

        return modelMapper.map(updatedClaim, ExpenseClaimResponseDTO.class);
    }

    @Override
    @Transactional
    public void deleteClaim(Long id) {
        ExpenseClaim claim = findClaimById(id);

        if (claim.getStatus() == ClaimStatus.APPROVED) {
            throw new BadRequestException("Cannot Delete Approved Claim");
        }
        if (claim.getStatus() == ClaimStatus.REJECTED) {
            throw new BadRequestException("Cannot Delete Rejected Claim");
        }

        claimRepository.delete(claim);
        log.info("Expense Claim Deleted with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExpenseClaimResponseDTO> getClaims(
            Long departmentId, ExpenseCategory expenseCategory, ClaimStatus status,
            Integer month, Integer year, String employeeName, Pageable pageable) {

        Specification<ExpenseClaim> spec = ExpenseClaimSpecification.filterClaims(
                departmentId, expenseCategory, status, month, year, employeeName);

        return claimRepository.findAll(spec, pageable)
                .map(claim -> modelMapper.map(claim, ExpenseClaimResponseDTO.class));
    }

    private ExpenseClaim findClaimById(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + id));
    }
}
