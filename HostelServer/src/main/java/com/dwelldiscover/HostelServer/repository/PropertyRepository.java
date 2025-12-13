package com.dwelldiscover.HostelServer.repository;

import com.dwelldiscover.HostelServer.model.Property;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends MongoRepository<Property, String> {

    // SAME METHOD NAME, NOW VALID
    @Query(value = "{}", fields = "{ city : 1 }")
    List<Property> findAllCities();

    List<Property> findByNameContainingIgnoreCaseOrCityContainingIgnoreCase(
            String name,
            String city
    );

    // SAME METHOD NAMES
    List<Property> findByOwneruserId(String owneruserId);
    List<Property> findByVerified(boolean verified);
}
