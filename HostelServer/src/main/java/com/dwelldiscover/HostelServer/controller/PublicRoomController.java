package com.dwelldiscover.HostelServer.controller;

import com.dwelldiscover.HostelServer.dto.RoomResponseDTO;
import com.dwelldiscover.HostelServer.model.Room;
import com.dwelldiscover.HostelServer.repository.RoomRepository;
import com.dwelldiscover.HostelServer.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/public/rooms")
@CrossOrigin("*")
public class PublicRoomController {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomService roomService;

    @GetMapping
    public List<RoomResponseDTO> getPublicRooms() {
        return roomRepository
                .findByIsAvailableTrue()   // ✅ ONLY availability matters
                .stream()
                .map(roomService::toDTO)
                .toList();
    }


    @GetMapping("/{id}")
    public RoomResponseDTO getRoom(@PathVariable String id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.isVerified() || !room.isAvailable()) {
            throw new RuntimeException("Room not available");
        }

        return roomService.toDTO(room); // ✅ CORRECT
    }
}
