package com.family.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagingResponse<T> {
    private List<T> content;
    private int pageIndex;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;

    public static <T> PagingResponse<T> fromPage(Page<T> page) {
        PagingResponse<T> response = new PagingResponse<>();
        response.setContent(page.getContent());
        response.setPageIndex(page.getNumber() + 1);
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setFirst(page.isFirst());
        response.setLast(page.isLast());
        return response;
    }

    public static <T, R> PagingResponse<R> fromPage(Page<T> page, List<R> mappedContent) {
        PagingResponse<R> response = new PagingResponse<>();
        response.setContent(mappedContent);
        response.setPageIndex(page.getNumber() + 1);
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setFirst(page.isFirst());
        response.setLast(page.isLast());
        return response;
    }
}
