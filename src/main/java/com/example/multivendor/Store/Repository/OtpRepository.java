package com.example.multivendor.Store.Repository;

import com.example.multivendor.Store.Model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findFirstByEmailOrderByIdDesc(String email);
}
