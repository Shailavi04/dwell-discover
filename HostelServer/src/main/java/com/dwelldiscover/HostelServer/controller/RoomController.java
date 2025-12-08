package com.dwelldiscover.HostelServer.controller;

import com.dwelldiscover.HostelServer.dto.RoomResponseDTO;
import com.dwelldiscover.HostelServer.model.Room;
import com.dwelldiscover.HostelServer.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // Get all rooms
    @GetMapping
    public List<RoomResponseDTO> getAllRooms() {
        return roomService.getAllRooms();
    }

    // Get single room
    @GetMapping("/{id}")
    public Optional<Room> getRoomById(@PathVariable String id) {
        return roomService.getRoomById(id);
    }

    // Filter - verified
    @GetMapping("/verified")
    @PreAuthorize("hasAuthority('rooms')")
    public List<RoomResponseDTO> getVerifiedRooms() {
        return roomService.getRoomsByVerification(true);
    }

    // Filter - unverified
    @GetMapping("/unverified")
    @PreAuthorize("hasAuthority('rooms')")
    public List<RoomResponseDTO> getUnverifiedRooms() {
        return roomService.getRoomsByVerification(false);
    }

    // Verify / Unverify Room
    @PutMapping("/{id}/verify")
    @PreAuthorize("hasAuthority('rooms')")
    public RoomResponseDTO toggleVerify(@PathVariable String id) {
        return roomService.toggleVerify(id);
    }

    // Add room
    @PostMapping
    public Room addRoom(@RequestBody Room room) {
        return roomService.addRoom(room);
    }

    // Update room
    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable String id, @RequestBody Room roomDetails) {
        return roomService.updateRoom(id, roomDetails);
    }

    // Delete room
    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable String id) {
        roomService.deleteRoom(id);
    }
}
