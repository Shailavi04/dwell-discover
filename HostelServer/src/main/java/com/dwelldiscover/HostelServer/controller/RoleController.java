package com.dwelldiscover.HostelServer.controller;

import com.dwelldiscover.HostelServer.model.Roles;
import com.dwelldiscover.HostelServer.service.RoleService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin("*")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping
    public List<Roles> getRoles() {
        return roleService.getAllRoles();
    }

    @PutMapping("/{id}/permissions")
    public Roles updatePermissions(
            @PathVariable Integer id,
            @RequestBody List<String> permissions) {
        return roleService.updateRolePermissions(id, permissions);
    }
}
