package com.department.demo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
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
public class DepartmentBudgetRequestDTO {

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Month is required")
    private Month month;

    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be valid")
    @Max(value = 2100, message = "Year must be valid")
    private Integer year;

    @NotNull(message = "Budget amount is required")
    @Positive(message = "Budget amount must be greater than zero")
    private BigDecimal budgetAmount;
}
