package com.dwelldiscover.HostelServer.service;

import com.dwelldiscover.HostelServer.dto.RoomResponseDTO;
import com.dwelldiscover.HostelServer.model.Property;
import com.dwelldiscover.HostelServer.model.Room;
import com.dwelldiscover.HostelServer.model.User;
import com.dwelldiscover.HostelServer.repository.PropertyRepository;
import com.dwelldiscover.HostelServer.repository.RoomRepository;
import com.dwelldiscover.HostelServer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    // --------------------------
    // DTO MAPPER
    // --------------------------
    private RoomResponseDTO toDTO(Room room) {

        Property property = propertyRepository.findById(room.getPropertyId()).orElse(null);
        User owner = userRepository.findById(room.getOwneruserId()).orElse(null);

        return new RoomResponseDTO(
                room.getId(),
                room.getName(),
                room.getType(),
                room.getDescription(),

                room.getCapacity(),
                room.getPricePerMonth(),
                room.getPricePerDay(),
                room.isAvailable(),

                property != null ? property.getName() : "",
                property != null ? property.getCity() : "",
                property != null ? property.getAddress() : "",
                property != null ? property.getContact() : "",

                owner != null ? owner.getName() : "",
                owner != null ? owner.getEmail() : "",

                room.isVerified()
        );
    }

    // --------------------------
    // GET ALL ROOMS
    // --------------------------
    public List<RoomResponseDTO> getAllRooms() {
        return roomRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // --------------------------
    // TOGGLE VERIFY (RETURN DTO)
    // --------------------------
    public RoomResponseDTO toggleVerify(String id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setVerified(!room.isVerified());
        room.setUpdatedAt(new Date());
        roomRepository.save(room);

        return toDTO(room);
    }

    // --------------------------
    // GET BY VERIFICATION (FOR FILTERS)
    // --------------------------
    public List<RoomResponseDTO> getRoomsByVerification(boolean verified) {
        return roomRepository.findAll()
                .stream()
                .filter(r -> r.isVerified() == verified)
                .map(this::toDTO)
                .toList();
    }

    // --------------------------
    // GET SINGLE ROOM
    // --------------------------
    public Optional<Room> getRoomById(String id) {
        return roomRepository.findById(id);
    }

    // --------------------------
    // ADD ROOM
    // --------------------------
    public Room addRoom(Room room) {
        room.setCreatedAt(new Date());
        room.setUpdatedAt(new Date());
        return roomRepository.save(room);
    }

    // --------------------------
    // UPDATE ROOM
    // --------------------------
    public Room updateRoom(String id, Room roomDetails) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setName(roomDetails.getName());
        room.setType(roomDetails.getType());
        room.setDescription(roomDetails.getDescription());
        room.setCapacity(roomDetails.getCapacity());
        room.setPricePerMonth(roomDetails.getPricePerMonth());
        room.setPricePerDay(roomDetails.getPricePerDay());
        room.setAvailable(roomDetails.isAvailable());
        room.setImages(roomDetails.getImages());
        room.setRoomAmenities(roomDetails.getRoomAmenities());
        room.setGenderType(roomDetails.getGenderType());
        room.setSecurityDeposit(roomDetails.getSecurityDeposit());
        room.setRoomNumber(roomDetails.getRoomNumber());
        room.setReported(roomDetails.isReported());

        room.setUpdatedAt(new Date());

        return roomRepository.save(room);
    }

    // --------------------------
    // DELETE ROOM
    // --------------------------
    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }
}
