package com.example.multivendor.Store.Repository;

import com.example.multivendor.Store.Model.Role;
import com.example.multivendor.Store.Model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
