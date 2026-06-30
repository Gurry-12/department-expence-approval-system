package com.department.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Month;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinanceSummaryDTO {
    private String departmentName;
    private Month month;
    private Integer year;
    private BigDecimal monthlyBudget;
    private BigDecimal totalApprovedExpense;
    private BigDecimal totalPendingExpense;
    private BigDecimal remainingBudget;
    private Long approvedClaimCount;
    private Long pendingClaimCount;
    private Long rejectedClaimCount;
}
