package com.family.common.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
public class PagingRequest {

    @Min(value = 1, message = "PageIndex must be greater than or equal to 1")
    private Integer pageIndex = 1;

    @Min(value = 1, message = "PageSize must be greater than or equal to 1")
    private Integer pageSize = 10;

    private String keyword;
    private String sortField;
    private String sortDirection = "DESC";

    private String gender;
    private String generation;
    private String status;
    private String annual;
    private String role;
    private String category;

    public Pageable toPageable() {
        Sort sort = Sort.unsorted();
        if (sortField != null && !sortField.trim().isEmpty()) {
            Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
            sort = Sort.by(direction, sortField);
        }
        return PageRequest.of(pageIndex - 1, pageSize, sort);
    }
}
