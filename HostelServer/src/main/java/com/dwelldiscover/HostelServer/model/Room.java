package com.dwelldiscover.HostelServer.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rooms")
public class Room {

    @Id
    private String id;

    private String name;
    private String owneruserId;
    private String propertyId;

    private String type;
    private String description;

    private int capacity;
    private int occupied = 0;
    private double pricePerMonth;
    private double pricePerDay;
    private double securityDeposit;

    private boolean isAvailable = true;

    private List<String> images;
    private List<String> roomAmenities;

    private String genderType;
    private String roomNumber;

    private boolean isReported = false;
    private boolean verified = false;


    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;
}
