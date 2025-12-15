    package com.dwelldiscover.HostelServer.controller;
    
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.security.core.GrantedAuthority;
    import com.dwelldiscover.HostelServer.model.Booking;
    import com.dwelldiscover.HostelServer.service.BookingService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import jakarta.servlet.http.HttpServletRequest;
    import com.dwelldiscover.HostelServer.service.JwtUtil;
    
    @RestController
    @RequestMapping("/api/bookings")
    public class BookingController {
    
        @Autowired
        BookingService bookingService;
    
        @Autowired
        JwtUtil jwtUtil;
    
        // ADMIN — Get all bookings
        @GetMapping
        public ResponseEntity<?> getAllBookings() {
            return ResponseEntity.ok(bookingService.getAllBookings());
        }
    
        // CREATE BOOKING
        @PostMapping("/create")
        public ResponseEntity<?> createBooking(
                @RequestBody Booking booking,
                HttpServletRequest request
        ) {
            String authHeader = request.getHeader("Authorization");
    
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
    
            String token = authHeader.substring(7);
    
            String role = jwtUtil.extractRole(token);
            String userId = jwtUtil.extractUserId(token);
    
            System.out.println("ROLE FROM JWT = " + role);
            System.out.println("USER ID FROM JWT = " + userId);
    
            // 🔒 ONLY STUDENT CAN BOOK
            if (role == null || !"STUDENT".equalsIgnoreCase(role.trim())) {
                return ResponseEntity
                        .status(403)
                        .body("Only students can book rooms");
            }
    
            // ✅ SET USER ID FROM JWT
            booking.setUserId(userId);
    
            return ResponseEntity.ok(bookingService.createBooking(booking));
        }
    
        // UPDATE BOOKING STATUS
        @PutMapping("/{id}/status")
        public ResponseEntity<?> updateStatus(
                @PathVariable String id,
                @RequestParam String status
        ) {
            return ResponseEntity.ok(bookingService.updateStatus(id, status));
        }
    
        // USER BOOKINGS
        @GetMapping("/user/{userId}")
        public ResponseEntity<?> userBookings(@PathVariable String userId) {
            return ResponseEntity.ok(bookingService.getUserBookings(userId));
        }
    
        // OWNER BOOKINGS
        @GetMapping("/owner/{ownerId}")
        public ResponseEntity<?> ownerBookings(@PathVariable String ownerId) {
            return ResponseEntity.ok(bookingService.getOwnerBookings(ownerId));
        }
    }