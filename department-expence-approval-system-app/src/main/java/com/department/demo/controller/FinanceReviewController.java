package com.department.demo.controller;

import com.department.demo.dto.ReviewRequestDTO;
import com.department.demo.response.GlobalResponse;
import com.department.demo.service.FinanceReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class FinanceReviewController {

    private final FinanceReviewService reviewService;

    @PostMapping("/{claimId}/review")
    public ResponseEntity<GlobalResponse<Void>> reviewClaim(
            @PathVariable Long claimId,
            @Valid @RequestBody ReviewRequestDTO requestDTO) {
        reviewService.reviewClaim(claimId, requestDTO);
        return ResponseEntity.ok(GlobalResponse.success(null, "Claim reviewed successfully"));
    }
}
