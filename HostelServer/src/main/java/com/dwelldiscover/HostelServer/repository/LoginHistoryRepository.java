package com.dwelldiscover.HostelServer.repository;

import com.dwelldiscover.HostelServer.model.LoginHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LoginHistoryRepository extends MongoRepository<LoginHistory, String> {

    List<LoginHistory> findByUserEmailOrderByTimestampDesc(String userEmail);
}
