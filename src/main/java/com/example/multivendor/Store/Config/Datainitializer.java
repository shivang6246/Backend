package com.example.multivendor.Store.Config;

import com.example.multivendor.Store.Model.Role;
import com.example.multivendor.Store.Model.RoleName;
import com.example.multivendor.Store.Repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor

public class Datainitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        if (roleRepository.count() == 0) {
            Role customerRole = new Role();
            customerRole.setName(RoleName.CUSTOMER);
            roleRepository.save(customerRole);

            Role sellerRole = new Role();
            sellerRole.setName(RoleName.SELLER);
            roleRepository.save(sellerRole);

            Role adminRole = new Role();
            adminRole.setName(RoleName.ADMIN);
            roleRepository.save(adminRole);
        } else {
            System.out.println("Roles already exist in the database.");
        }

    }
}