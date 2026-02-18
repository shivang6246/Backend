package com.example.multivendor.Store.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("ultronhor037@gmail.com"); // MUST match verified sender
            message.setTo(toEmail);
            message.setSubject("Your OTP Code");
            message.setText("Your OTP is: " + otp + "\nIt will expire in 5 minutes.");

            mailSender.send(message);

            log.info("Email successfully sent to {}", toEmail);

        } catch (Exception e) {
            log.error("Email sending failed: {}", e.getMessage(), e);
            throw new RuntimeException("Email sending failed");
        }
    }
}
