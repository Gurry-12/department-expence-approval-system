package com.department.demo.dto;

import com.department.demo.enums.ExpenseCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseClaimRequestDTO {

    @NotBlank(message = "Employee name is required")
    private String employeeName;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Expense category is required")
    private ExpenseCategory expenseCategory;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Expense date is required")
    @PastOrPresent(message = "Expense date cannot be in the future")
    private LocalDate expenseDate;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
}
