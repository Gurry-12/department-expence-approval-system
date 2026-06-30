package com.department.demo.controller;

import com.department.demo.dto.FinanceSummaryDTO;
import com.department.demo.response.GlobalResponse;
import com.department.demo.service.FinanceSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Month;

@RestController
@RequestMapping("/api/finance-summary")
@RequiredArgsConstructor
public class FinanceSummaryController {

    private final FinanceSummaryService summaryService;

    @GetMapping
    public ResponseEntity<GlobalResponse<FinanceSummaryDTO>> getFinanceSummary(
            @RequestParam Long departmentId,
            @RequestParam Month month,
            @RequestParam Integer year) {

        FinanceSummaryDTO summary = summaryService.getFinanceSummary(departmentId, month, year);
        return ResponseEntity.ok(GlobalResponse.success(summary, "Finance summary generated successfully"));
    }
}
