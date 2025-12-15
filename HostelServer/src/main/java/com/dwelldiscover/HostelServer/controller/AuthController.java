package com.dwelldiscover.HostelServer.controller;

import com.dwelldiscover.HostelServer.model.*;
import com.dwelldiscover.HostelServer.repository.*;
import com.dwelldiscover.HostelServer.service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    @Autowired
    private OwnerRepository ownerRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired private AuthService authService;
    @Autowired private EmailService emailService;
    @Autowired private OtpRepository otpRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private LoginHistoryRepository loginHistoryRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;


    // ---------------------------------------------------------
    // REGISTER
    // ---------------------------------------------------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // 1️⃣ First register user normally using existing logic
            String result = authService.register(user);

            // 2️⃣ Fetch saved user from DB (because authService already saved it)
            Optional<User> savedUserOpt = userRepository.findByEmail(user.getEmail());

            if (savedUserOpt.isPresent()) {
                User savedUser = savedUserOpt.get();

                // 3️⃣ If role = STUDENT (role id = 3) → Save inside students collection also
                if (savedUser.getRole() != null && savedUser.getRole().getId() == 3) {

                    Student student = new Student();
                    student.setUserId(savedUser.getId());
                    student.setVerified(false);

                    studentRepository.save(student);
                }
            }

            return ResponseEntity.ok(Map.of("message", result));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    // ---------------------------------------------------------
    // LOGIN (with Login History)
    // ---------------------------------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody LoginRequest req,
            HttpServletRequest request     // ⭐ Correct way to inject
    ) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(req.getEmail());

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();

            // INVALID PASSWORD → log fail
            if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {

                loginHistoryRepository.save(new LoginHistory(
                        null,
                        user.getEmail(),
                        LocalDateTime.now(),
                        request.getRemoteAddr(),
                        request.getHeader("User-Agent"),
                        false
                ));

                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid credentials"));
            }

            // VALID LOGIN → save success
            loginHistoryRepository.save(new LoginHistory(
                    null,
                    user.getEmail(),
                    LocalDateTime.now
(),
                    request.getRemoteAddr(),
                    request.getHeader("User-Agent"),
                    true
            ));

            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            // JWT Claims
            List<String> permissionsList = user.getRole().getPermissions();

            Map<String, Object> claims = new HashMap<>();
            claims.put("role", user.getRole().getName());
            claims.put("permissions", permissionsList);
            claims.put("authorities", permissionsList); // for Spring Security
            claims.put("userId", user.getId());

            String token = jwtUtil.generateToken(claims, user.getEmail());

            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "email", user.getEmail(),
                            "name", user.getName(),
                            "userId", user.getId(),
                            "role", user.getRole().getName(),
                            "permissions", permissionsList
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }


    // ---------------------------------------------------------
    // SEND OTP
    // ---------------------------------------------------------
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        long expiry = System.currentTimeMillis() + (10 * 60 * 1000);

        otpRepository.deleteByEmail(email);
        otpRepository.save(new OtpEntry(email, otp, expiry));

        emailService.sendOtpEmail(email, otp);

        return ResponseEntity.ok(
                Map.of(
                        "message", "OTP sent to email",
                        "expiryTimeSeconds", (expiry - System.currentTimeMillis()) / 1000
                )
        );
    }


    // ---------------------------------------------------------
    // VERIFY OTP
    // ---------------------------------------------------------
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String otp = request.get("otp");

        Optional<OtpEntry> entryOpt = otpRepository.findByEmail(email);

        if (entryOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("verified", false, "message", "OTP not found"));
        }

        OtpEntry entry = entryOpt.get();

        if (System.currentTimeMillis() > entry.getExpiryTime()) {
            otpRepository.deleteByEmail(email);
            return ResponseEntity.badRequest().body(Map.of("verified", false, "message", "OTP expired"));
        }

        if (!entry.getOtp().equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("verified", false, "message", "Invalid OTP"));
        }

        otpRepository.deleteByEmail(email);
        return ResponseEntity.ok(Map.of("verified", true, "message", "OTP verified"));
    }


    // ---------------------------------------------------------
    // FORGOT PASSWORD
    // ---------------------------------------------------------
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {

        String email = request.get("email");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email not registered"));
        }

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        long expiry = System.currentTimeMillis() + (5 * 60 * 1000);

        otpRepository.deleteByEmail(email);
        otpRepository.save(new OtpEntry(email, otp, expiry));
        emailService.sendOtpEmail(email, otp);

        return ResponseEntity.ok(Map.of("message", "OTP sent to email"));
    }


    // ---------------------------------------------------------
    // RESET PASSWORD
    // ---------------------------------------------------------
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String newPassword = request.get("newPassword");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }
}