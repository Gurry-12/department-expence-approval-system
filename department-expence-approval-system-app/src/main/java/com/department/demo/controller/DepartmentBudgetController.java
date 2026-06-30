package com.department.demo.controller;

import com.department.demo.dto.DepartmentBudgetRequestDTO;
import com.department.demo.dto.DepartmentBudgetResponseDTO;
import com.department.demo.response.GlobalResponse;
import com.department.demo.service.DepartmentBudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class DepartmentBudgetController {

    private final DepartmentBudgetService budgetService;

    @PostMapping
    public ResponseEntity<GlobalResponse<DepartmentBudgetResponseDTO>> createBudget(@Valid @RequestBody DepartmentBudgetRequestDTO requestDTO) {
        DepartmentBudgetResponseDTO created = budgetService.createBudget(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GlobalResponse.success(created, "Budget created successfully"));
    }

    @GetMapping
    public ResponseEntity<GlobalResponse<List<DepartmentBudgetResponseDTO>>> getAllBudgets() {
        List<DepartmentBudgetResponseDTO> budgets = budgetService.getAllBudgets();
        return ResponseEntity.ok(GlobalResponse.success(budgets, "Budgets retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalResponse<DepartmentBudgetResponseDTO>> getBudgetById(@PathVariable Long id) {
        DepartmentBudgetResponseDTO budget = budgetService.getBudgetById(id);
        return ResponseEntity.ok(GlobalResponse.success(budget, "Budget retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalResponse<DepartmentBudgetResponseDTO>> updateBudget(
            @PathVariable Long id, 
            @Valid @RequestBody DepartmentBudgetRequestDTO requestDTO) {
        DepartmentBudgetResponseDTO updated = budgetService.updateBudget(id, requestDTO);
        return ResponseEntity.ok(GlobalResponse.success(updated, "Budget updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalResponse<Void>> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok(GlobalResponse.success(null, "Budget deleted successfully"));
    }
}
