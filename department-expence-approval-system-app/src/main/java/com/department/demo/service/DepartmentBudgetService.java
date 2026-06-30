package com.department.demo.service;

import com.department.demo.dto.DepartmentBudgetRequestDTO;
import com.department.demo.dto.DepartmentBudgetResponseDTO;

import java.util.List;

public interface DepartmentBudgetService {
    DepartmentBudgetResponseDTO createBudget(DepartmentBudgetRequestDTO requestDTO);
    List<DepartmentBudgetResponseDTO> getAllBudgets();
    DepartmentBudgetResponseDTO getBudgetById(Long id);
    DepartmentBudgetResponseDTO updateBudget(Long id, DepartmentBudgetRequestDTO requestDTO);
    void deleteBudget(Long id);
}
