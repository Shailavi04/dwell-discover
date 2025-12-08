package com.dwelldiscover.HostelServer.repository;

import com.dwelldiscover.HostelServer.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByOwnerId(String ownerId);

    List<Booking> findByRoomId(String roomId);

    long countByStatus(String status);
}
