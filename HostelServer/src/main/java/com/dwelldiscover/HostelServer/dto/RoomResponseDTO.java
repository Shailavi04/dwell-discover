package com.dwelldiscover.HostelServer.dto;

import lombok.Data;
import java.util.List;

@Data
public class RoomResponseDTO {

    private String id;
    private String name;
    private String type;
    private String description;

    private int capacity;
    private double pricePerMonth;
    private double pricePerDay;
    private boolean available;

    // Property details
    private String propertyName;
    private String city;
    private String address;
    private String contact;

    // Owner details
    private String ownerName;
    private String ownerEmail;

    // Room status
    private boolean verified;

    // 🔥 REQUIRED FOR EXPLORE PAGE
    private List<String> images;
    private String genderType;

    public RoomResponseDTO(
            String id,
            String name,
            String type,
            String description,
            int capacity,
            double pricePerMonth,
            double pricePerDay,
            boolean available,
            String propertyName,
            String city,
            String address,
            String contact,
            String ownerName,
            String ownerEmail,
            boolean verified,
            List<String> images,
            String genderType
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.capacity = capacity;
        this.pricePerMonth = pricePerMonth;
        this.pricePerDay = pricePerDay;
        this.available = available;

        this.propertyName = propertyName;
        this.city = city;
        this.address = address;
        this.contact = contact;

        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;

        this.verified = verified;
        this.images = images;
        this.genderType = genderType;
    }
}
