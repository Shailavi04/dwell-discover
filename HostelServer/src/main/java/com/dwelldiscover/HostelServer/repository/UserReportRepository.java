package com.dwelldiscover.HostelServer.repository;

import com.dwelldiscover.HostelServer.model.UserReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UserReportRepository extends MongoRepository<UserReport, String> {

    List<UserReport> findByEntityTypeAndReportedEntityId(String entityType, String reportedEntityId);

    List<UserReport> findByEntityType(String entityType);
}
