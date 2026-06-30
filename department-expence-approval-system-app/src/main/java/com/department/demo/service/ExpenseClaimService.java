package com.department.demo.service;

import com.department.demo.dto.ExpenseClaimRequestDTO;
import com.department.demo.dto.ExpenseClaimResponseDTO;
import com.department.demo.enums.ClaimStatus;
import com.department.demo.enums.ExpenseCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ExpenseClaimService {
    ExpenseClaimResponseDTO createClaim(ExpenseClaimRequestDTO requestDTO);
    ExpenseClaimResponseDTO getClaimById(Long id);
    ExpenseClaimResponseDTO updateClaim(Long id, ExpenseClaimRequestDTO requestDTO);
    void deleteClaim(Long id);
    
    Page<ExpenseClaimResponseDTO> getClaims(
            Long departmentId,
            ExpenseCategory expenseCategory,
            ClaimStatus status,
            Integer month,
            Integer year,
            String employeeName,
            Pageable pageable);
}
