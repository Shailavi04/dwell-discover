package com.dwelldiscover.HostelServer.service;

import com.dwelldiscover.HostelServer.model.Property;
import com.dwelldiscover.HostelServer.dto.PropertyDTO;
import com.dwelldiscover.HostelServer.repository.PropertyRepository;
import com.dwelldiscover.HostelServer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.dwelldiscover.HostelServer.model.User;
import java.util.List;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    // SEARCH or ALL
    public List<Property> searchProperties(String search) {
        if (search == null || search.trim().isEmpty()) {
            return propertyRepository.findAll();
        }
        return propertyRepository.findByNameContainingIgnoreCaseOrCityContainingIgnoreCase(search, search);
    }

    // GET BY OWNER
    public List<Property> getByOwner(String ownerId) {
        return propertyRepository.findByOwneruserId(ownerId);
    }

    // CREATE
    public Property create(Property p) {
        return propertyRepository.save(p);
    }

    // UPDATE
    public Property update(String id, Property p) {
        p.setId(id);
        return propertyRepository.save(p);
    }

    // DELETE
    public void delete(String id) {
        propertyRepository.deleteById(id);
    }

    // FIND BY ID
    public Property findById(String id) {
        return propertyRepository.findById(id).orElse(null);
    }

    // PROPERTY + OWNER NAME
    public List<PropertyDTO> getAllWithOwners(List<Property> props) {
        return props.stream().map(p -> {
            PropertyDTO dto = new PropertyDTO();

            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setContact(p.getContact());
            dto.setCity(p.getCity());
            dto.setAddress(p.getAddress());
            dto.setDescription(p.getDescription());
            dto.setVerified(p.isVerified());
            dto.setOwnerId(p.getOwnerId());

            // Fetch owner’s user record
            userRepository.findById(p.getOwnerId()).ifPresent(owner -> {
                dto.setOwnerName(owner.getName());
                dto.setOwnerEmail(owner.getEmail());
            });

            return dto;
        }).toList();
    }
}
