package com.family.modules.auth.service.impl;

import com.family.common.exception.BusinessException;
import com.family.common.exception.ResourceNotFoundException;
import com.family.common.exception.UnauthorizedException;
import com.family.modules.auth.dto.*;
import com.family.modules.auth.service.AuthService;
import com.family.modules.user.entity.User;
import com.family.modules.user.repository.UserRepository;
import com.family.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.getUsername()));

        if (!user.getEnabled() || !user.getActive() || user.getDeleted()) {
            throw new UnauthorizedException("User account is inactive or disabled");
        }

        String accessToken = jwtTokenProvider.generateToken(user.getUsername());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername());

        // Update refresh token in DB
        user.setRefreshToken(refreshToken);
        long refreshExpiryMs = jwtTokenProvider.getExpirationMs() * 7; // Matches configuration
        user.setRefreshTokenExpiry(LocalDateTime.now().plusSeconds(refreshExpiryMs / 1000));
        userRepository.save(user);

        return LoginResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getExpirationMs() / 1000)
                .build();
    }

    @Override
    @Transactional
    public LoginResponse refresh(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        if (!jwtTokenProvider.isTokenValid(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        String username = jwtTokenProvider.extractUsername(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("User not found for this token"));

        if (user.getRefreshToken() == null || !user.getRefreshToken().equals(refreshToken)) {
            throw new UnauthorizedException("Refresh token does not match or was invalidated");
        }

        if (user.getRefreshTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("Refresh token has expired");
        }

        String newAccessToken = jwtTokenProvider.generateToken(user.getUsername());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername());

        user.setRefreshToken(newRefreshToken);
        long refreshExpiryMs = jwtTokenProvider.getExpirationMs() * 7;
        user.setRefreshTokenExpiry(LocalDateTime.now().plusSeconds(refreshExpiryMs / 1000));
        userRepository.save(user);

        return LoginResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(jwtTokenProvider.getExpirationMs() / 1000)
                .build();
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String resetToken = jwtTokenProvider.generateResetToken(user.getUsername());
        
        // Print token in logs for easy local testing
        log.info("--------------------------------------------------");
        log.info("PASSWORD RESET REQUEST FOR USER: {}", user.getUsername());
        log.info("RESET TOKEN: {}", resetToken);
        log.info("--------------------------------------------------");

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Yêu cầu đặt lại mật khẩu - Website Dòng Họ");
            message.setText("Để đặt lại mật khẩu của bạn, vui lòng sử dụng mã/token sau (hiệu lực trong 15 phút):\n\n" 
                    + resetToken + "\n\nNếu bạn không yêu cầu điều này, hãy bỏ qua email này.");
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send reset password email: {}", e.getMessage());
            // We do not throw exception here in dev, to let users use the console logged token
        }
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String token = request.getToken();
        if (!jwtTokenProvider.isTokenValid(token)) {
            throw new BusinessException("INVALID_TOKEN", "Reset token is invalid or expired");
        }

        String username = jwtTokenProvider.extractUsername(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setRefreshToken(null); // Invalidate session
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void logout(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRefreshToken(null);
        user.setRefreshTokenExpiry(null);
        userRepository.save(user);
    }
}
