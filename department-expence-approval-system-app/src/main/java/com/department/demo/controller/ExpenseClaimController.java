package com.department.demo.controller;

import com.department.demo.dto.ExpenseClaimRequestDTO;
import com.department.demo.dto.ExpenseClaimResponseDTO;
import com.department.demo.enums.ClaimStatus;
import com.department.demo.enums.ExpenseCategory;
import com.department.demo.response.GlobalResponse;
import com.department.demo.service.ExpenseClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ExpenseClaimController {

    private final ExpenseClaimService claimService;

    @PostMapping
    public ResponseEntity<GlobalResponse<ExpenseClaimResponseDTO>> createClaim(@Valid @RequestBody ExpenseClaimRequestDTO requestDTO) {
        ExpenseClaimResponseDTO created = claimService.createClaim(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(GlobalResponse.success(created, "Expense Claim submitted successfully"));
    }

    @GetMapping
    public ResponseEntity<GlobalResponse<Page<ExpenseClaimResponseDTO>>> getClaims(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) ExpenseCategory expenseCategory,
            @RequestParam(required = false) ClaimStatus status,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String employeeName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ExpenseClaimResponseDTO> claims = claimService.getClaims(
                departmentId, expenseCategory, status, month, year, employeeName, pageable);

        return ResponseEntity.ok(GlobalResponse.success(claims, "Expense Claims retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalResponse<ExpenseClaimResponseDTO>> getClaimById(@PathVariable Long id) {
        ExpenseClaimResponseDTO claim = claimService.getClaimById(id);
        return ResponseEntity.ok(GlobalResponse.success(claim, "Expense Claim retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalResponse<ExpenseClaimResponseDTO>> updateClaim(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseClaimRequestDTO requestDTO) {
        ExpenseClaimResponseDTO updated = claimService.updateClaim(id, requestDTO);
        return ResponseEntity.ok(GlobalResponse.success(updated, "Expense Claim updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GlobalResponse<Void>> deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
        return ResponseEntity.ok(GlobalResponse.success(null, "Expense Claim deleted successfully"));
    }
}
