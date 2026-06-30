package com.department.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentBudgetResponseDTO {
    private Long id;
    private DepartmentResponseDTO department;
    private Month month;
    private Integer year;
    private BigDecimal budgetAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
