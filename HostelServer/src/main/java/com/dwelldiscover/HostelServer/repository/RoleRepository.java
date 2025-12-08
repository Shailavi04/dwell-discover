package com.dwelldiscover.HostelServer.repository;

import com.dwelldiscover.HostelServer.model.Roles;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends MongoRepository<Roles, Integer> {

}
