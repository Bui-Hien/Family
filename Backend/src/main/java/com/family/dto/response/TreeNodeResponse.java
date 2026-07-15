package com.family.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TreeNodeResponse {
    private UUID id;
    private String fullName;
    private String gender;
    private LocalDate birthDate;
    private LocalDate deathDate;
    private Integer generation;
    private String avatarUrl;
    
    private UUID fatherId;
    private String fatherName;
    private UUID motherId;
    private String motherName;
    
    private TreeNodeResponse spouse;
    
    @Builder.Default
    private List<TreeNodeResponse> children = new ArrayList<>();
}
