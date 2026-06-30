package com.department.demo.repository;

import com.department.demo.entity.ExpenseClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.department.demo.enums.ClaimStatus;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseClaimRepository extends JpaRepository<ExpenseClaim, Long>, JpaSpecificationExecutor<ExpenseClaim> {

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM ExpenseClaim e WHERE e.department.id = :departmentId AND e.status = :status AND MONTH(e.expenseDate) = :month AND YEAR(e.expenseDate) = :year")
    BigDecimal calculateTotalApprovedAmount(
            @Param("departmentId") Long departmentId,
            @Param("status") ClaimStatus status,
            @Param("month") Integer month,
            @Param("year") Integer year
    );

    @Query("SELECT " +
            "COALESCE(SUM(CASE WHEN e.status = com.department.demo.enums.ClaimStatus.APPROVED THEN e.amount ELSE 0 END), 0), " +
            "COALESCE(SUM(CASE WHEN e.status = com.department.demo.enums.ClaimStatus.PENDING THEN e.amount ELSE 0 END), 0), " +
            "COALESCE(SUM(CASE WHEN e.status = com.department.demo.enums.ClaimStatus.APPROVED THEN 1L ELSE 0L END), 0L), " +
            "COALESCE(SUM(CASE WHEN e.status = com.department.demo.enums.ClaimStatus.PENDING THEN 1L ELSE 0L END), 0L), " +
            "COALESCE(SUM(CASE WHEN e.status = com.department.demo.enums.ClaimStatus.REJECTED THEN 1L ELSE 0L END), 0L) " +
            "FROM ExpenseClaim e " +
            "WHERE e.department.id = :departmentId " +
            "AND MONTH(e.expenseDate) = :month " +
            "AND YEAR(e.expenseDate) = :year")
    List<Object[]> getFinanceSummaryAggregation(
            @Param("departmentId") Long departmentId,
            @Param("month") Integer month,
            @Param("year") Integer year
    );
}
