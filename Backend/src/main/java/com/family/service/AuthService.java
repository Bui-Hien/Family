package com.family.service;

import com.family.dto.request.*;
import com.family.dto.response.*;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse refresh(RefreshTokenRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void logout(String username);
}
