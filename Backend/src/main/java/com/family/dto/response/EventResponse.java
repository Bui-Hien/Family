package com.family.dto.response;

import com.family.common.base.BaseResponse;
import com.family.common.enums.StatusEnum;
import com.family.entity.Event;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class EventResponse extends BaseResponse {
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private LocalDateTime endDate;
    private String location;
    private Boolean annual;
    private StatusEnum status;

    public static EventResponse fromEntity(Event event) {
        if (event == null) {
            return null;
        }
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .endDate(event.getEndDate())
                .location(event.getLocation())
                .annual(event.getAnnual())
                .status(event.getStatus())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
