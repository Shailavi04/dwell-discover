package com.dwelldiscover.HostelServer.repository;

import com.dwelldiscover.HostelServer.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {

    List<Room> findByPropertyId(String propertyId);

    List<Room> findByIsAvailable(boolean isAvailable);

    List<Room> findByGenderType(String genderType);

    List<Room> findByType(String type);

    List<Room> findByPricePerMonthBetween(double min, double max);

    // FIXED METHOD NAME (WORKS WITH YOUR MODEL)
    long countByReported(boolean reported);

    List<Room> findByPropertyIdIn(List<String> propertyIds);

    List<Room> findByVerifiedTrueAndIsAvailableTrue();
}
