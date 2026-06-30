package com.department.demo.service.impl;

import com.department.demo.dto.FinanceSummaryDTO;
import com.department.demo.entity.DepartmentBudget;
import com.department.demo.exception.ResourceNotFoundException;
import com.department.demo.repository.DepartmentBudgetRepository;
import com.department.demo.repository.ExpenseClaimRepository;
import com.department.demo.service.FinanceSummaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Month;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FinanceSummaryServiceImpl implements FinanceSummaryService {

    private final DepartmentBudgetRepository budgetRepository;
    private final ExpenseClaimRepository claimRepository;

    @Override
    @Transactional(readOnly = true)
    public FinanceSummaryDTO getFinanceSummary(Long departmentId, Month month, Integer year) {
        log.info("Generating finance summary for Department: {}, Month: {}, Year: {}", departmentId, month, year);

        // 1. Fetch Budget
        DepartmentBudget budget = budgetRepository.findByDepartmentIdAndMonthAndYear(departmentId, month, year)
                .orElseThrow(() -> new ResourceNotFoundException("Budget Not Found for Department in " + month + "/" + year));

        // 2. Fetch Aggregation
        List<Object[]> aggregationResult = claimRepository.getFinanceSummaryAggregation(departmentId, month.getValue(), year);
        
        BigDecimal totalApprovedExpense = BigDecimal.ZERO;
        BigDecimal totalPendingExpense = BigDecimal.ZERO;
        Long approvedCount = 0L;
        Long pendingCount = 0L;
        Long rejectedCount = 0L;

        if (aggregationResult != null && !aggregationResult.isEmpty()) {
            Object[] row = aggregationResult.get(0);
            totalApprovedExpense = row[0] != null ? new BigDecimal(row[0].toString()) : BigDecimal.ZERO;
            totalPendingExpense = row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO;
            approvedCount = row[2] != null ? Long.valueOf(row[2].toString()) : 0L;
            pendingCount = row[3] != null ? Long.valueOf(row[3].toString()) : 0L;
            rejectedCount = row[4] != null ? Long.valueOf(row[4].toString()) : 0L;
        }

        // 3. Calculate Remaining Budget
        BigDecimal remainingBudget = budget.getBudgetAmount().subtract(totalApprovedExpense);

        // 4. Build DTO
        return FinanceSummaryDTO.builder()
                .departmentName(budget.getDepartment().getDepartmentName())
                .month(month)
                .year(year)
                .monthlyBudget(budget.getBudgetAmount())
                .totalApprovedExpense(totalApprovedExpense)
                .totalPendingExpense(totalPendingExpense)
                .remainingBudget(remainingBudget)
                .approvedClaimCount(approvedCount)
                .pendingClaimCount(pendingCount)
                .rejectedClaimCount(rejectedCount)
                .build();
    }
}
