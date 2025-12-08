package com.dwelldiscover.HostelServer.controller;

import com.dwelldiscover.HostelServer.repository.UserRepository;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.dwelldiscover.HostelServer.model.Owner;
import com.dwelldiscover.HostelServer.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Date;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;



@RestController
@RequestMapping("/api/owners")
@CrossOrigin("*")
public class OwnerController {

    @Autowired private OwnerRepository ownerRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping("")
    public ResponseEntity<?> getAllOwners() {
        List<Owner> owners = ownerRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();

        for (Owner owner : owners) {
            Map<String, Object> map = new HashMap<>();

            map.put("id", owner.getId());
            map.put("userId", owner.getUserId());
            map.put("verified", owner.isVerified());
            map.put("documents", owner.getDocuments());
            map.put("businessName", owner.getBusinessName());
            map.put("address", owner.getAddress());
            map.put("updatedAt", owner.getUpdatedAt());

            // FETCH USER
            userRepository.findById(owner.getUserId()).ifPresent(user -> {
                Map<String, Object> userData = new HashMap<>();
                userData.put("name", user.getName());
                userData.put("email", user.getEmail());
                map.put("user", userData);
            });

            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/verified")
    public List<Owner> getVerifiedOwners() {
        return ownerRepository.findByVerified(true);
    }

    @GetMapping("/unverified")
    public List<Owner> getUnverifiedOwners() {
        return ownerRepository.findByVerified(false);
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyOwner(@PathVariable String id) {
        return ownerRepository.findById(id).map(owner -> {
            owner.setVerified(true);
            ownerRepository.save(owner);

            return ResponseEntity.ok(Map.of("message", "Owner verified"));
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "Owner not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOwner(@PathVariable String id) {
        return ownerRepository.findById(id).map(owner -> {
            ownerRepository.delete(owner);
            return ResponseEntity.ok(Map.of("message", "Owner deleted"));
        }).orElse(ResponseEntity.status(404).body(Map.of("error", "Owner not found")));
    }
}
