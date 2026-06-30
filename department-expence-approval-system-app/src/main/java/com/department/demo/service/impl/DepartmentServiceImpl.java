package com.department.demo.service.impl;

import com.department.demo.dto.DepartmentRequestDTO;
import com.department.demo.dto.DepartmentResponseDTO;
import com.department.demo.entity.Department;
import com.department.demo.exception.BadRequestException;
import com.department.demo.exception.DuplicateResourceException;
import com.department.demo.exception.ResourceNotFoundException;
import com.department.demo.repository.DepartmentRepository;
import com.department.demo.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public DepartmentResponseDTO createDepartment(DepartmentRequestDTO requestDTO) {
        String name = requestDTO.getDepartmentName().trim();

        if (departmentRepository.existsByDepartmentNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Department with name '" + name + "' already exists");
        }

        Department department = Department.builder()
                .departmentName(name)
                .build();

        Department savedDepartment = departmentRepository.save(department);
        log.info("Department Created with ID: {}", savedDepartment.getId());

        return modelMapper.map(savedDepartment, DepartmentResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(dept -> modelMapper.map(dept, DepartmentResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponseDTO getDepartmentById(Long id) {
        Department department = findDepartmentById(id);
        return modelMapper.map(department, DepartmentResponseDTO.class);
    }

    @Override
    @Transactional
    public DepartmentResponseDTO updateDepartment(Long id, DepartmentRequestDTO requestDTO) {
        Department department = findDepartmentById(id);
        String newName = requestDTO.getDepartmentName().trim();

        if (departmentRepository.existsByDepartmentNameIgnoreCaseAndIdNot(newName, id)) {
            throw new DuplicateResourceException("Department with name '" + newName + "' already exists");
        }

        department.setDepartmentName(newName);
        Department updatedDepartment = departmentRepository.save(department);
        log.info("Department Updated with ID: {}", updatedDepartment.getId());

        return modelMapper.map(updatedDepartment, DepartmentResponseDTO.class);
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        Department department = findDepartmentById(id);

        if (!department.getBudgets().isEmpty()) {
            throw new BadRequestException("Cannot delete department because budgets exist");
        }
        if (!department.getExpenseClaims().isEmpty()) {
            throw new BadRequestException("Cannot delete department because expense claims exist");
        }

        departmentRepository.delete(department);
        log.info("Department Deleted with ID: {}", id);
    }

    private Department findDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
    }
}
