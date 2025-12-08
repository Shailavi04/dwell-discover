package com.dwelldiscover.HostelServer.repository;

import com.dwelldiscover.HostelServer.model.Owner;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

@Repository
public interface OwnerRepository extends MongoRepository<Owner, String> {

    long countByIsReported(boolean isReported);

    @Query(value = "{}", fields = "{ city : 1 }")
    List<Owner> findAllCities();
    // 🔥 ADD THIS METHOD
    List<Owner> findByVerified(boolean verified);

    // (Optional) for analytics
    long countByVerified(boolean verified);

}
