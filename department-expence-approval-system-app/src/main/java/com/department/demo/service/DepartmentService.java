package com.department.demo.service;

import com.department.demo.dto.DepartmentRequestDTO;
import com.department.demo.dto.DepartmentResponseDTO;

import java.util.List;

public interface DepartmentService {
    DepartmentResponseDTO createDepartment(DepartmentRequestDTO requestDTO);
    List<DepartmentResponseDTO> getAllDepartments();
    DepartmentResponseDTO getDepartmentById(Long id);
    DepartmentResponseDTO updateDepartment(Long id, DepartmentRequestDTO requestDTO);
    void deleteDepartment(Long id);
}
