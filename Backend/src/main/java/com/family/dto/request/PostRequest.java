package com.family.dto.request;

import com.family.common.enums.StatusEnum;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String summary;
    private String content;
    private String featuredImage;
    private Boolean featured = false;
    private StatusEnum status = StatusEnum.DRAFT;
    private String category;
}
