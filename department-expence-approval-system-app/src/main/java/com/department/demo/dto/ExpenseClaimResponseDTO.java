package com.department.demo.dto;

import com.department.demo.enums.ClaimStatus;
import com.department.demo.enums.ExpenseCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseClaimResponseDTO {
    private Long id;
    private String employeeName;
    private String department;
    private ExpenseCategory expenseCategory;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private String description;
    private ClaimStatus status;
    private String reviewRemark;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
