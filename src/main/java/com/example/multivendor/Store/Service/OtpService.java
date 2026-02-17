package com.example.multivendor.Store.Service;

import com.example.multivendor.Store.Model.Otp;
import com.example.multivendor.Store.Repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;

    public void generateOtp(String email) {

        log.info("Generating OTP for email: {}", email);

        // Delete old OTPs for this email
        otpRepository.findFirstByEmailOrderByIdDesc(email)
                .ifPresent(oldOtp -> {
                    log.info("Deleting old OTP for email: {}", email);
                    otpRepository.delete(oldOtp);
                });

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        Otp otpEntity = new Otp();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpEntity.setVerified(false);

        Otp savedOtp = otpRepository.save(otpEntity);
        log.info("OTP saved successfully - ID: {}, Email: {}, OTP: {}, Expiry: {}",
                savedOtp.getId(), savedOtp.getEmail(), savedOtp.getOtp(), savedOtp.getExpiryTime());

        emailService.sendOtpEmail(email, otp);
        log.info("OTP email sent to: {}", email);
    }

    public boolean validateOtp(String email, String enteredOtp) {

        log.info("Validating OTP for email: '{}', entered OTP: '{}'", email, enteredOtp);

        // Check all OTPs in database for this email
        var allOtps = otpRepository.findAll();
        log.info("Total OTPs in database: {}", allOtps.size());
        allOtps.forEach(o -> log.info("DB OTP - ID: {}, Email: '{}', OTP: '{}', Verified: {}",
                o.getId(), o.getEmail(), o.getOtp(), o.getVerified()));

        Otp otp = otpRepository.findFirstByEmailOrderByIdDesc(email)
                .orElseThrow(() -> {
                    log.error("OTP not found for email: '{}'", email);
                    return new RuntimeException("OTP not found");
                });

        log.info("Found OTP - ID: {}, Email: '{}', OTP: '{}', Expiry: {}, Verified: {}",
                otp.getId(), otp.getEmail(), otp.getOtp(), otp.getExpiryTime(), otp.getVerified());

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            log.error("OTP expired for email: {}", email);
            throw new RuntimeException("OTP expired");
        }

        if (!otp.getOtp().equals(enteredOtp)) {
            log.error("Invalid OTP for email: {}. Expected: '{}', Got: '{}'", email, otp.getOtp(), enteredOtp);
            throw new RuntimeException("Invalid OTP");
        }

        otp.setVerified(true);
        otpRepository.save(otp);

        log.info("OTP verified successfully for email: {}", email);
        return true;
    }
}
