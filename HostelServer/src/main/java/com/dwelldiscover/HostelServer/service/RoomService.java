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
import org.springframework.web.multipart.MultipartFile;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class RoomService {

    @Autowired
    private GridFsService gridFsService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    // --------------------------
    // DTO MAPPER
    // --------------------------
    public RoomResponseDTO toDTO(Room room) {

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
    // ADD ROOM (WITH IMAGES)
    // --------------------------
    public Room addRoom(Room room, MultipartFile[] images) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Property property = propertyRepository.findById(room.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (!property.getOwneruserId().equals(user.getId())
                && !"ADMIN".equals(user.getRole().getName())) {
            throw new RuntimeException("You cannot add room to this property");
        }

        List<String> imageIds = new ArrayList<>();
        if (images != null) {
            for (MultipartFile file : images) {
                imageIds.add(gridFsService.store(file));
            }
        }

        room.setImages(imageIds);
        room.setOwneruserId(user.getId());
        room.setVerified(false);
        room.setCreatedAt(new Date());
        room.setUpdatedAt(new Date());

        return roomRepository.save(room);
    }

    // --------------------------
    // ✅ UPDATE ROOM (FIXED)
    // --------------------------
    public Room updateRoom(String id, Room updatedData, MultipartFile[] newImages) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔒 OWNER OR ADMIN ONLY
        if (!room.getOwneruserId().equals(user.getId())
                && !"ADMIN".equals(user.getRole().getName())) {
            throw new RuntimeException("Forbidden");
        }

        // Update fields
        room.setName(updatedData.getName());
        room.setType(updatedData.getType());
        room.setDescription(updatedData.getDescription());
        room.setCapacity(updatedData.getCapacity());
        room.setPricePerMonth(updatedData.getPricePerMonth());
        room.setPricePerDay(updatedData.getPricePerDay());
        room.setRoomNumber(updatedData.getRoomNumber());
        room.setGenderType(updatedData.getGenderType());
        room.setSecurityDeposit(updatedData.getSecurityDeposit());
        room.setUpdatedAt(new Date());

        // Append new images
        if (newImages != null && newImages.length > 0) {
            List<String> images =
                    room.getImages() != null ? room.getImages() : new ArrayList<>();

            for (MultipartFile file : newImages) {
                images.add(gridFsService.store(file));
            }
            room.setImages(images);
        }

        return roomRepository.save(room);
    }

    // --------------------------
    // GET ROOMS BASED ON ROLE
    // --------------------------
    public List<RoomResponseDTO> getAllRoomsBasedOnRole() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Room> rooms;

        if ("ADMIN".equals(user.getRole().getName())) {
            rooms = roomRepository.findAll();
        } else {
            List<String> propertyIds = propertyRepository
                    .findByOwneruserId(user.getId())
                    .stream()
                    .map(Property::getId)
                    .toList();

            rooms = roomRepository.findByPropertyIdIn(propertyIds);
        }

        return rooms.stream().map(this::toDTO).toList();
    }

    // --------------------------
    // TOGGLE VERIFY
    // --------------------------
    public RoomResponseDTO toggleVerify(String id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        room.setVerified(!room.isVerified());
        room.setUpdatedAt(new Date());
        return toDTO(roomRepository.save(room));
    }

    public Optional<Room> getRoomById(String id) {
        return roomRepository.findById(id);
    }

    public List<RoomResponseDTO> getRoomsByVerification(boolean verified) {
        return roomRepository.findAll().stream()
                .filter(r -> r.isVerified() == verified)
                .map(this::toDTO)
                .toList();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }
}
