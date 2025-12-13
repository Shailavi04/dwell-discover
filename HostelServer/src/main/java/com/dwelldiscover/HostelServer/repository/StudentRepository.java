package com.dwelldiscover.HostelServer.repository;

import com.dwelldiscover.HostelServer.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StudentRepository extends MongoRepository<Student, String> {
}
