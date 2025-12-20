package com.dwelldiscover.HostelServer.repository;

import com.dwelldiscover.HostelServer.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByOwnerId(String ownerId);

    List<Booking> findByRoomId(String roomId);

    boolean existsByUserIdAndRoomIdAndStatus(
            String userId,
            String roomId,
            String status
    );

    long countByStatus(String status);
}
