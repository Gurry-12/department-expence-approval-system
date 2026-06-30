package com.department.demo.service.impl;

import com.department.demo.dto.ReviewRequestDTO;
import com.department.demo.entity.DepartmentBudget;
import com.department.demo.entity.ExpenseClaim;
import com.department.demo.enums.ClaimStatus;
import com.department.demo.exception.BadRequestException;
import com.department.demo.exception.ResourceNotFoundException;
import com.department.demo.repository.DepartmentBudgetRepository;
import com.department.demo.repository.ExpenseClaimRepository;
import com.department.demo.service.FinanceReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class FinanceReviewServiceImpl implements FinanceReviewService {

    private final ExpenseClaimRepository claimRepository;
    private final DepartmentBudgetRepository budgetRepository;

    @Override
    @Transactional
    public void reviewClaim(Long claimId, ReviewRequestDTO requestDTO) {
        
        if (requestDTO.getRecommendedStatus() == ClaimStatus.PENDING) {
            throw new BadRequestException("Invalid Status: PENDING cannot be used as a review status");
        }

        ExpenseClaim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim Not Found with ID: " + claimId));

        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new BadRequestException("Already Reviewed: Claim is in status " + claim.getStatus());
        }

        if (requestDTO.getRecommendedStatus() == ClaimStatus.APPROVED) {
            handleApproval(claim, requestDTO.getReviewRemark());
        } else if (requestDTO.getRecommendedStatus() == ClaimStatus.REJECTED) {
            handleRejection(claim, requestDTO.getReviewRemark());
        }
    }

    private void handleApproval(ExpenseClaim claim, String reviewRemark) {
        java.time.Month month = claim.getExpenseDate().getMonth();
        int year = claim.getExpenseDate().getYear();
        Long departmentId = claim.getDepartment().getId();

        // 1. Find Department Budget
        DepartmentBudget budget = budgetRepository.findByDepartmentIdAndMonthAndYear(departmentId, month, year)
                .orElseThrow(() -> new ResourceNotFoundException("Budget Not Found for Department in " + month + "/" + year));

        // 2. Calculate Total Approved Expense
        BigDecimal totalApproved = claimRepository.calculateTotalApprovedAmount(
                departmentId, ClaimStatus.APPROVED, month.getValue(), year);

        // 3. Remaining Budget
        BigDecimal remainingBudget = budget.getBudgetAmount().subtract(totalApproved);

        // 4. Compare Claim Amount
        if (claim.getAmount().compareTo(remainingBudget) > 0) {
            log.warn("Budget Exceeded for Department ID: {}", departmentId);
            throw new BadRequestException("Approval exceeds remaining department budget.");
        }

        // 5. Approve
        claim.setStatus(ClaimStatus.APPROVED);
        claim.setReviewRemark(reviewRemark);
        claim.setReviewedAt(LocalDateTime.now());
        claimRepository.save(claim);
        log.info("Claim Approved: {}", claim.getId());
    }

    private void handleRejection(ExpenseClaim claim, String reviewRemark) {
        claim.setStatus(ClaimStatus.REJECTED);
        claim.setReviewRemark(reviewRemark);
        claim.setReviewedAt(LocalDateTime.now());
        claimRepository.save(claim);
        log.info("Claim Rejected: {}", claim.getId());
    }
}
