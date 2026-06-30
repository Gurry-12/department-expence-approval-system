package com.department.demo.controller;

import com.department.demo.dto.DepartmentRequestDTO;
import com.department.demo.dto.DepartmentResponseDTO;
import com.department.demo.response.GlobalResponse;
import com.department.demo.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<GlobalResponse<DepartmentResponseDTO>> createDepartment(@Valid @RequestBody DepartmentRequestDTO requestDTO) {
        DepartmentResponseDTO created = departmentService.createDepartment(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GlobalResponse.success(created, "Department created successfully"));
    }

    @GetMapping
    public ResponseEntity<GlobalResponse<List<DepartmentResponseDTO>>> getAllDepartments() {
        List<DepartmentResponseDTO> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(GlobalResponse.success(departments, "Departments retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalResponse<DepartmentResponseDTO>> getDepartmentById(@PathVariable Long id) {
        DepartmentResponseDTO department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(GlobalResponse.success(department, "Department retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalResponse<DepartmentResponseDTO>> updateDepartment(
            @PathVariable Long id, 
            @Valid @RequestBody DepartmentRequestDTO requestDTO) {
        DepartmentResponseDTO updated = departmentService.updateDepartment(id, requestDTO);
        return ResponseEntity.ok(GlobalResponse.success(updated, "Department updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(GlobalResponse.success(null, "Department deleted successfully"));
    }
}
