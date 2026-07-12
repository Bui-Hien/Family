package com.family.modules.file.repository;

import com.family.modules.file.entity.FileDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FileDescriptionRepository extends JpaRepository<FileDescription, UUID> {
}
