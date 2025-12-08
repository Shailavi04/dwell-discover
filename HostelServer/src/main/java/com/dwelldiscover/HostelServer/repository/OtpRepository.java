package com.dwelldiscover.HostelServer.repository;

import com.dwelldiscover.HostelServer.model.OtpEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface OtpRepository extends MongoRepository<OtpEntry, String> {

    Optional<OtpEntry> findByEmail(String email);

    void deleteByEmail(String email);
}
