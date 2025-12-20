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

            boolean alreadyBooked = bookingRepo
                    .existsByUserIdAndRoomIdAndStatus(
                            booking.getUserId(),
                            booking.getRoomId(),
                            "CONFIRMED"
                    );

            if (alreadyBooked) {
                throw new RuntimeException("You have already booked this room");
            }

            Room room = roomRepo.findById(booking.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            if (room.getOccupied() >= room.getCapacity()) {
                throw new RuntimeException("Room is full");
            }

            booking.setPropertyId(room.getPropertyId());

            Property property = propertyRepo.findById(room.getPropertyId())
                    .orElseThrow(() -> new RuntimeException("Property not found"));

            booking.setOwnerId(property.getOwnerId());

            // 👉 ideally PENDING, but keeping your flow
            booking.setStatus("CONFIRMED");

            LocalDateTime now = LocalDateTime.now();
            booking.setCreatedAt(now);
            booking.setUpdatedAt(now);
            booking.setStartDate(now);

            String type = booking.getBookingType();

            // ================= MONTHLY =================
            if ("MONTHLY".equalsIgnoreCase(type)) {

                if (booking.getDurationMonths() == null || booking.getDurationMonths() < 1) {
                    throw new RuntimeException("Duration is required");
                }
                double rentAmount =
                        room.getPricePerMonth() * booking.getDurationMonths();

                double securityDeposit =
                        room.getSecurityDeposit();

                booking.setTotalAmount(rentAmount + securityDeposit);


                booking.setTotalAmount(rentAmount + securityDeposit);
                booking.setEndDate(now.plusMonths(booking.getDurationMonths()));

            }
            // ================= DAILY =================
            else if ("DAILY".equalsIgnoreCase(type)) {

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

            // 🔒 OCCUPY SEAT
            room.setOccupied(room.getOccupied() + 1);
            if (room.getOccupied() >= room.getCapacity()) {
                room.setAvailable(false);
            }
            roomRepo.save(room);

            return bookingRepo.save(booking);
        }

        public void confirmBooking(String bookingId) {

            Booking booking = bookingRepo.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            booking.setStatus("CONFIRMED");

            bookingRepo.save(booking);
        }

        // ================= UPDATE STATUS =================
        public Booking updateStatus(String bookingId, String status) {

            Booking booking = bookingRepo.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            Room room = roomRepo.findById(booking.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            // 🔁 Only cancellation affects room occupancy now
            if ("CANCELLED".equalsIgnoreCase(status)
                    && "CONFIRMED".equalsIgnoreCase(booking.getStatus())) {

                room.setOccupied(Math.max(0, room.getOccupied() - 1));
                room.setAvailable(true);
                roomRepo.save(room);
            }

            booking.setStatus(status.toUpperCase());
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

        public Booking getBookingById(String bookingId) {
            return bookingRepo.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
        }

    }
