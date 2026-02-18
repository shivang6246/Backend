package com.example.multivendor.Store.Controller;

import com.example.multivendor.Store.Dto.AuthResponse;
import com.example.multivendor.Store.Dto.LoginRequest;
import com.example.multivendor.Store.Dto.OtpRequest;
import com.example.multivendor.Store.Dto.RegisterRequest;
import com.example.multivendor.Store.Service.AuthService;
import com.example.multivendor.Store.Service.OtpService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request) throws Exception {

        logger.info("Register request received for email: {}", request.getEmail());

        String response = authService.registerUser(request);

        logger.info("User registered successfully: {}", request.getEmail());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) throws Exception {

        logger.info("Login attempt for email: {}", request.getEmail());

        try {
            AuthResponse response = authService.loginUser(request);
            logger.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Login failed for email: {}. Error: {}",
                    request.getEmail(), e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {

        logger.info("OTP generation requested for email: {}", email);

        otpService.generateOtp(email);

        logger.info("OTP sent successfully to email: {}", email);

        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpRequest request) {

        logger.info("OTP verification attempt for email: {}", request.getEmail());

        boolean isValid = otpService.validateOtp(
                request.getEmail(),
                request.getOtp());

        if (isValid) {
            logger.info("OTP verified successfully for email: {}", request.getEmail());
            return ResponseEntity.ok("OTP verified successfully");
        } else {
            logger.warn("Invalid OTP attempt for email: {}", request.getEmail());
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
    }

    @GetMapping("/")
    public String home() {
        logger.info("Health check endpoint hit");
        return "Backend is running 🚀";
    }
}
