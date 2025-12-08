package com.dwelldiscover.HostelServer.service;

import com.dwelldiscover.HostelServer.model.Roles;
import com.dwelldiscover.HostelServer.repository.RoleRepository;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepo;

    public List<Roles> getAllRoles() {
        return roleRepo.findAll();
    }

    public Roles updateRolePermissions(Integer id, List<String> permissions) {
        Roles role = roleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        role.setPermissions(permissions);

        return roleRepo.save(role);
    }
}
