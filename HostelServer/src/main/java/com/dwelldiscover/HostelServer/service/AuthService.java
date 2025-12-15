package com.dwelldiscover.HostelServer.service;

import com.dwelldiscover.HostelServer.model.Roles;
import com.dwelldiscover.HostelServer.model.User;
import com.dwelldiscover.HostelServer.model.Owner;
import com.dwelldiscover.HostelServer.repository.RoleRepository;
import com.dwelldiscover.HostelServer.repository.UserRepository;
import com.dwelldiscover.HostelServer.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OwnerRepository ownerRepository;


    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    // =========================
    // REGISTER
    // =========================
    public String register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists!");
        }

        // Validate role
        Integer roleId = user.getRole().getId();
        Roles role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Invalid role ID!"));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);

        // Save user once
        User savedUser = userRepository.save(user);

        // If role is OWNER → Create Owner document
        if (role.getName().equalsIgnoreCase("OWNER")) {

            Owner owner = new Owner();
            owner.setUserId(savedUser.getId());   // link to user
            owner.setVerified(false);
            owner.setDocuments(new ArrayList<>());
            owner.setUpdatedAt(LocalDateTime.now());
            ownerRepository.save(owner);
        }

        return "User registered successfully!";
    }



    // =========================
    // LOGIN
    // =========================
    public Map<String, Object> login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        Roles role = user.getRole();
        List<String> permissionsList = role.getPermissions();  // <-- Your permission list

        // ------------------------------
        // FIXED JWT CLAIMS
        // ------------------------------
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role.getName());
        claims.put("permissions", permissionsList);   // Frontend use
        claims.put("authorities", permissionsList);   // SPRING SECURITY USE
        // ------------------------------

        String token = jwtUtil.generateToken(claims, user.getEmail());

        // Return token + user info
        return Map.of(
                "token", token,
                "role", role.getName(),
                "permissions", permissionsList,
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail()
                )
        );
    }
}
