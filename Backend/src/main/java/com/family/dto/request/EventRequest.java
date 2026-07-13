package com.family.dto.request;

import com.family.common.enums.StatusEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRequest {

    @NotBlank(message = "Event title is required")
    private String title;

    private String description;

    @NotNull(message = "Event start date is required")
    private LocalDateTime eventDate;

    private LocalDateTime endDate;

    private String location;

    private Boolean annual = false;

    private StatusEnum status = StatusEnum.ACTIVE;
}
