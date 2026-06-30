package com.department.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Month;
import java.time.Year;

@Entity
@Table(name = "department_budgets", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"department_id", "budget_month", "budget_year"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentBudget extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "department_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Department department;

    @Column(name = "budget_month", nullable = false)
    @Enumerated(EnumType.STRING)
    private Month month;

    @Column(name = "budget_year", nullable = false)
    private Integer year;

    @Column(name = "budget_amount", nullable = false)
    private BigDecimal budgetAmount;
}
