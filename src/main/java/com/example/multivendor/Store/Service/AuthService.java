package com.example.multivendor.Store.Service;

import com.example.multivendor.Store.Dto.AuthResponse;
import com.example.multivendor.Store.Dto.LoginRequest;
import com.example.multivendor.Store.Dto.RegisterRequest;
import com.example.multivendor.Store.Model.Role;
import com.example.multivendor.Store.Model.RoleName;
import com.example.multivendor.Store.Model.User;
import com.example.multivendor.Store.Repository.RoleRepository;
import com.example.multivendor.Store.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String registerUser(RegisterRequest request) throws Exception {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new Exception("Email already exists");
        }

        Role customerRole = roleRepository.findByName(RoleName.CUSTOMER)
                .orElseThrow(() -> new Exception("Customer role not found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Set.of(customerRole));
        userRepository.save(user);
        return "User registered successfully";

    }

    public AuthResponse loginUser(LoginRequest request) throws Exception {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new Exception("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new Exception("Invalid password");
        }

        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(java.util.stream.Collectors.toSet());

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                roles,
                "mock-token" // Placeholder for JWT
        );
    }

}
