package com.department.demo.dto;

import com.department.demo.enums.ClaimStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDTO {

    @NotNull(message = "Recommended status is required")
    private ClaimStatus recommendedStatus;

    @NotBlank(message = "Review remark is mandatory")
    private String reviewRemark;
}
