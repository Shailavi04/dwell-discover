package com.dwelldiscover.HostelServer.controller;

import com.dwelldiscover.HostelServer.model.Property;
import com.dwelldiscover.HostelServer.dto.PropertyDTO;
import com.dwelldiscover.HostelServer.service.PropertyService;
import com.dwelldiscover.HostelServer.repository.PropertyRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/property-list")
@CrossOrigin("*")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private PropertyRepository propertyRepository;

    // GET ALL (with ownerName + ownerEmail)
    @GetMapping("")
    public List<PropertyDTO> getAllProperties(
            @RequestParam(required = false) String search
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // 1️⃣ Get logged-in email (JWT subject)
        String email = auth.getName();

        // 2️⃣ Load user from DB
        var user = propertyService.getUserByEmail(email); // we’ll add this

        List<Property> props;

        // 3️⃣ ADMIN → all properties
        if ("ADMIN".equals(user.getRole().getName())) {
            props = propertyService.searchProperties(search);
        }
        // 4️⃣ OWNER → only his properties
        else {
            props = propertyRepository.findByOwneruserId(user.getId());
        }

        return propertyService.getAllWithOwners(props);
    }
    // GET UNVERIFIED ONLY
    @GetMapping("/unverified")
    public List<PropertyDTO> getUnverifiedProperties() {
        List<Property> props = propertyRepository.findByVerified(false);
        return propertyService.getAllWithOwners(props);
    }

    // GET PROPERTY BY OWNER ID
    @GetMapping("/owner/{ownerId}")
    public List<PropertyDTO> getPropertiesByOwner(@PathVariable String ownerId) {
        List<Property> props = propertyService.getByOwner(ownerId);
        return propertyService.getAllWithOwners(props);
    }

    // CREATE
    @PostMapping("")
    public Property createProperty(@RequestBody Property property) {
        return propertyService.create(property);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteProperty(@PathVariable String id) {
        propertyService.delete(id);
    }

    // VERIFY / UNVERIFY
    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyProperty(@PathVariable String id) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        var user = propertyService.getUserByEmail(email);

        // ❌ BLOCK OWNER
        if (!"ADMIN".equals(user.getRole().getName())) {
            return ResponseEntity
                    .status(403)
                    .body(Map.of("error", "Only admin can verify properties"));
        }

        return propertyRepository.findById(id).map(property -> {
            property.setVerified(!property.isVerified());
            propertyRepository.save(property);
            return ResponseEntity.ok(Map.of("message", "Property verification updated"));
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "Property not found")));
    }

    // UPDATE
    @PutMapping("/{id}")
    public Property updateProperty(
            @PathVariable String id,
            @RequestBody Property property
    ) {
        return propertyService.update(id, property);
    }
}
