package com.dwelldiscover.HostelServer.repository;

import com.dwelldiscover.HostelServer.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

// ADD THESE IMPORTS ↓↓↓
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Page<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name,
            String email,
            Pageable pageable
    );

    // For verified / unverified users
    List<User> findByVerified(boolean verified);
}
