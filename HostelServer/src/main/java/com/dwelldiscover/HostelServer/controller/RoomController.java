package com.dwelldiscover.HostelServer.controller;

import com.dwelldiscover.HostelServer.dto.RoomResponseDTO;
import com.dwelldiscover.HostelServer.model.Room;
import com.dwelldiscover.HostelServer.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // ============================
    // GET ALL ROOMS
    // ============================
    @GetMapping
    public List<RoomResponseDTO> getAllRooms() {
        return roomService.getAllRoomsBasedOnRole();
    }

    // ============================
    // GET SINGLE ROOM
    // ============================
    @GetMapping("/{id}")
    public Optional<Room> getRoomById(@PathVariable String id) {
        return roomService.getRoomById(id);
    }

    // ============================
    // ADD ROOM (WITH IMAGES)
    // ============================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Room addRoom(
            @RequestPart("data") Room room,
            @RequestPart(value = "images", required = false) MultipartFile[] images
    ) {
        return roomService.addRoom(room, images);
    }

    // ============================
    // UPDATE ROOM (WITH IMAGES)
    // ============================
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> updateRoom(
            @PathVariable String id,
            @RequestPart("data") Room room,
            @RequestPart(value = "newImages", required = false) MultipartFile[] newImages
    ) {
        return ResponseEntity.ok(
                roomService.updateRoom(id, room, newImages)
        );
    }

    // ============================
    // VERIFY / UNVERIFY (ADMIN)
    // ============================
    @PutMapping("/{id}/verify")
    public ResponseEntity<?> toggleVerify(@PathVariable String id) {
        return ResponseEntity.ok(roomService.toggleVerify(id));
    }

    // ============================
    // DELETE ROOM
    // ============================
    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable String id) {
        roomService.deleteRoom(id);
    }
}
