package com.family.modules.auth.service;

import com.family.modules.auth.dto.*;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse refresh(RefreshTokenRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void logout(String username);
}
