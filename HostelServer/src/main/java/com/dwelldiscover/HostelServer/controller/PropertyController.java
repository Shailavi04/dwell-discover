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
        List<Property> props = propertyService.searchProperties(search);
        return propertyService.getAllWithOwners(props);
    }

    // GET VERIFIED ONLY
    @GetMapping("/verified")
    public List<PropertyDTO> getVerifiedProperties() {
        List<Property> props = propertyRepository.findByVerified(true);
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
