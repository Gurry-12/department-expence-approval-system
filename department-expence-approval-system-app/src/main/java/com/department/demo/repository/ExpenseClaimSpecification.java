package com.department.demo.repository;

import com.department.demo.entity.ExpenseClaim;
import com.department.demo.enums.ClaimStatus;
import com.department.demo.enums.ExpenseCategory;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class ExpenseClaimSpecification {

    public static Specification<ExpenseClaim> filterClaims(
            Long departmentId,
            ExpenseCategory expenseCategory,
            ClaimStatus status,
            Integer month,
            Integer year,
            String employeeName) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (departmentId != null) {
                predicates.add(cb.equal(root.get("department").get("id"), departmentId));
            }

            if (expenseCategory != null) {
                predicates.add(cb.equal(root.get("expenseCategory"), expenseCategory));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (employeeName != null && !employeeName.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("employeeName")), "%" + employeeName.trim().toLowerCase() + "%"));
            }

            if (month != null) {
                predicates.add(cb.equal(cb.function("MONTH", Integer.class, root.get("expenseDate")), month));
            }

            if (year != null) {
                predicates.add(cb.equal(cb.function("YEAR", Integer.class, root.get("expenseDate")), year));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
