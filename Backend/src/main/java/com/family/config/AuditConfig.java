package com.family.config;

import com.family.security.SecurityUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;
import java.util.UUID;

@Configuration
public class AuditConfig {

    @Bean
    public AuditorAware<UUID> auditorProvider() {
        return new AuditorAwareImpl();
    }

    public static class AuditorAwareImpl implements AuditorAware<UUID> {
        @Override
        public Optional<UUID> getCurrentAuditor() {
            return SecurityUtils.getCurrentUserId();
        }
    }
}
