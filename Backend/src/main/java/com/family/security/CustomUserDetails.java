package com.family.security;

import com.family.modules.user.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class CustomUserDetails implements UserDetails {

    private final User user;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.user = user;
        
        List<SimpleGrantedAuthority> auths = new ArrayList<>();
        // Add the role itself
        auths.add(new SimpleGrantedAuthority(user.getRole().name()));
        
        // Add all privileges mapped to this role
        user.getRole().getPrivileges().forEach(privilege -> {
            auths.add(new SimpleGrantedAuthority(privilege.name()));
        });
        
        this.authorities = auths;
    }

    public User getUser() {
        return user;
    }

    public UUID getId() {
        return user.getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !user.getLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getEnabled() && user.getActive() && !user.getDeleted();
    }
}
