package com.dwelldiscover.HostelServer.controller;

import com.dwelldiscover.HostelServer.model.Booking;
import com.dwelldiscover.HostelServer.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    BookingService bookingService;

    // ADMIN — Get all bookings
    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // CREATE BOOKING
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Booking booking) {
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
