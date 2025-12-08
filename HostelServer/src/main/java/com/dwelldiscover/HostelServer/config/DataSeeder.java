package com.dwelldiscover.HostelServer.config;

import com.dwelldiscover.HostelServer.model.Roles;
import com.dwelldiscover.HostelServer.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Roles(1, "ADMIN", List.of("dashboard","rooms","owners", "roles")));
            roleRepository.save(new Roles(2, "OWNER", List.of("owners")));
            roleRepository.save(new Roles(3, "STUDENT", List.of("search","viewRooms")));
        }
    }
}
