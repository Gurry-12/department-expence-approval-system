package com.department.demo.service;

import com.department.demo.dto.ReviewRequestDTO;

public interface FinanceReviewService {
    void reviewClaim(Long claimId, ReviewRequestDTO requestDTO);
}
