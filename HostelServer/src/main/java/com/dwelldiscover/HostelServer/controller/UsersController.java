package com.dwelldiscover.HostelServer.controller;

import com.dwelldiscover.HostelServer.model.LoginHistory;
import com.dwelldiscover.HostelServer.model.User;
import com.dwelldiscover.HostelServer.model.UserReport;
import com.dwelldiscover.HostelServer.repository.LoginHistoryRepository;
import com.dwelldiscover.HostelServer.repository.UserReportRepository;
import com.dwelldiscover.HostelServer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * UsersController
 *
 * - GET  /api/users?search=&page=&size=    -> paged users (optional search by name/email)
 * - GET  /api/users/{id}                   -> single user
 * - PUT  /api/users/{id}/block             -> block/unblock user (body: { "block": true })
 * - GET  /api/users/{email}/logins         -> login history for an email
 * - GET  /api/users/reported               -> list user reports
 * - PUT  /api/users/reports/{id}/resolve   -> mark report resolved
 *
 * Methods are protected with @PreAuthorize("hasAuthority('users')") so your JWT authorities are used.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UsersController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    @Autowired
    private UserReportRepository userReportRepository;

    // -------------------------
    // 1) GET users (paged + optional search)
    // -------------------------
    @GetMapping("")
    @PreAuthorize("hasAuthority('users')")
    public ResponseEntity<?> getUsers(
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "page", required = false, defaultValue = "0") int page,
            @RequestParam(name = "size", required = false, defaultValue = "20") int size,
            @RequestParam(name = "sort", required = false, defaultValue = "createdAt") String sort,
            @RequestParam(name = "dir", required = false, defaultValue = "desc") String dir
    ) {
        Sort.Direction direction = "asc".equalsIgnoreCase(dir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(direction, sort));

        Page<User> usersPage;
        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim();
            // Assumes your UserRepository has a method like:
            // Page<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email, Pageable pageable);
            usersPage = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q, pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("users", usersPage.getContent());
        resp.put("page", usersPage.getNumber());
        resp.put("size", usersPage.getSize());
        resp.put("totalPages", usersPage.getTotalPages());
        resp.put("totalElements", usersPage.getTotalElements());

        return ResponseEntity.ok(resp);
    }

    // -------------------------
    // 1b) GET single user by id
    // -------------------------
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('users')")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Optional<User> optional = userRepository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        return ResponseEntity.ok(optional.get());
    }

    // -------------------------
    // 2) Block / Unblock user
    // -------------------------
    @PutMapping("/{id}/block")
    public ResponseEntity<?> blockUnblock(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> body
    ) {
        boolean block = body.getOrDefault("block", true);

        Optional<User> optional = userRepository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = optional.get();
        user.setBlocked(block);
        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of("message", block ? "User blocked" : "User unblocked")
        );
    }


    // -------------------------
    // 3) Login history by user email (paged optional)
    // -------------------------
    @GetMapping("/{email}/logins")
    @PreAuthorize("hasAuthority('users')")
    public ResponseEntity<?> getLoginHistory(
            @PathVariable String email,
            @RequestParam(name = "page", required = false, defaultValue = "0") int page,
            @RequestParam(name = "size", required = false, defaultValue = "50") int size
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "timestamp"));
        // You can add a repository method that returns Page<LoginHistory> for pagination:
        // Page<LoginHistory> pageRes = loginHistoryRepository.findByUserEmail(email, pageable);
        // If you don't have that method, we'll fetch and then page in-memory:
        List<LoginHistory> all = loginHistoryRepository.findByUserEmailOrderByTimestampDesc(email);
        int from = Math.min(all.size(), page * size);
        int to = Math.min(all.size(), from + size);
        List<LoginHistory> content = all.subList(from, to);

        Map<String, Object> resp = new HashMap<>();
        resp.put("logins", content);
        resp.put("page", page);
        resp.put("size", size);
        resp.put("total", all.size());

        return ResponseEntity.ok(resp);
    }

    // -------------------------
    // 4) Reported users (all)
    // -------------------------
    @GetMapping("/reported")
    @PreAuthorize("hasAuthority('users')")
    public ResponseEntity<?> getReportedUsers() {
        // returns all reports where entityType == "USER"
        List<UserReport> reports = userReportRepository.findByEntityType("USER");
        return ResponseEntity.ok(reports);
    }

    // -------------------------
    // 5) Resolve a report
    // -------------------------
    @PutMapping("/reports/{id}/resolve")
    @PreAuthorize("hasAuthority('users')")
    public ResponseEntity<?> resolveReport(@PathVariable String id) {
        return userReportRepository.findById(id).map(report -> {
            report.setResolved(true);
            userReportRepository.save(report);
            return ResponseEntity.ok(Map.of("message", "Report resolved"));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Report not found")));
    }

    // -------------------------
    // 6) Utility: delete user (optional admin action)
    // -------------------------
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('users')")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "User deleted"));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found")));
    }
}
