package com.dwelldiscover.HostelServer.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String userId;        // Student who booked
    private String ownerId;       // Owner of the room
    private String propertyId;
    private String roomId;

    private String bookingType;    // MONTHLY / DAILY
    private String status;         // PENDING / APPROVED / REJECTED / CANCELLED

    private double totalAmount;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Integer durationMonths;  // Required for monthly bookings

    private Integer daysCount;       // Required for daily bookings

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
