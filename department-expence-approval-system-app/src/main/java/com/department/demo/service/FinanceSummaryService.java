package com.department.demo.service;

import com.department.demo.dto.FinanceSummaryDTO;
import java.time.Month;

public interface FinanceSummaryService {
    FinanceSummaryDTO getFinanceSummary(Long departmentId, Month month, Integer year);
}
