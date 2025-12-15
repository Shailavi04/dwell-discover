package com.dwelldiscover.HostelServer.service;
import com.dwelldiscover.HostelServer.model.Booking;
import com.dwelldiscover.HostelServer.model.Property;
import com.dwelldiscover.HostelServer.model.Room;
import com.dwelldiscover.HostelServer.repository.BookingRepository;
import com.dwelldiscover.HostelServer.repository.PropertyRepository;
import com.dwelldiscover.HostelServer.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    @Autowired
    BookingRepository bookingRepo;

    @Autowired
    RoomRepository roomRepo;

    @Autowired
    PropertyRepository propertyRepo;

    // ADMIN — GET ALL BOOKINGS
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    // ================= CREATE BOOKING =================
    public Booking createBooking(Booking booking) {

        Room room = roomRepo.findById(booking.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // 🚫 HARD CAPACITY CHECK
        if (room.getOccupied() >= room.getCapacity()) {
            throw new RuntimeException("Room is full");
        }

        // 🔒 OCCUPY SEAT IMMEDIATELY
        room.setOccupied(room.getOccupied() + 1);

        if (room.getOccupied() >= room.getCapacity()) {
            room.setAvailable(false);
        }

        roomRepo.save(room);

        booking.setPropertyId(room.getPropertyId());

        Property property = propertyRepo.findById(room.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        booking.setOwnerId(property.getOwnerId());

        // ✅ AUTO CONFIRM
        booking.setStatus("CONFIRMED");

        LocalDateTime now = LocalDateTime.now();
        booking.setCreatedAt(now);
        booking.setUpdatedAt(now);
        booking.setStartDate(now);

        String type = booking.getBookingType();

        if ("MONTHLY".equalsIgnoreCase(type)) {

            if (booking.getDurationMonths() == null || booking.getDurationMonths() < 1) {
                throw new RuntimeException("Duration is required");
            }

            booking.setTotalAmount(
                    room.getPricePerMonth() * booking.getDurationMonths()
            );
            booking.setEndDate(now.plusMonths(booking.getDurationMonths()));

        } else if ("DAILY".equalsIgnoreCase(type)) {

            if (booking.getDaysCount() == null || booking.getDaysCount() < 1) {
                throw new RuntimeException("Days count is required");
            }

            booking.setTotalAmount(
                    room.getPricePerDay() * booking.getDaysCount()
            );
            booking.setEndDate(now.plusDays(booking.getDaysCount()));

        } else {
            throw new RuntimeException("Invalid booking type");
        }

        return bookingRepo.save(booking);
    }


    // ================= UPDATE STATUS =================
    public Booking updateStatus(String bookingId, String status) {

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Room room = roomRepo.findById(booking.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if ("APPROVED".equalsIgnoreCase(status)) {

            if (room.getOccupied() >= room.getCapacity()) {
                throw new RuntimeException("Room is full");
            }

            room.setOccupied(room.getOccupied() + 1);

            if (room.getOccupied() >= room.getCapacity()) {
                room.setAvailable(false);
            }

            roomRepo.save(room);

        } else if ("REJECTED".equalsIgnoreCase(status)
                || "CANCELLED".equalsIgnoreCase(status)) {

            if ("APPROVED".equalsIgnoreCase(booking.getStatus())) {

                if (room.getOccupied() > 0) {
                    room.setOccupied(room.getOccupied() - 1);
                }

                room.setAvailable(true);
                roomRepo.save(room);
            }
        }

        booking.setStatus(status.toUpperCase());
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepo.save(booking);
    }

    public Booking cancelBooking(String bookingId) {

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"CONFIRMED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("Only confirmed bookings can be cancelled");
        }

        Room room = roomRepo.findById(booking.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setOccupied(Math.max(0, room.getOccupied() - 1));
        room.setAvailable(true);
        roomRepo.save(room);

        booking.setStatus("CANCELLED");
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepo.save(booking);
    }

    // ================= FETCH BOOKINGS =================
    public List<Booking> getUserBookings(String userId) {
        return bookingRepo.findByUserId(userId);
    }

    public List<Booking> getOwnerBookings(String ownerId) {
        return bookingRepo.findByOwnerId(ownerId);
    }
}
