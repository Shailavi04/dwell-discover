package com.dwelldiscover.HostelServer.model;

import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Id;

@Document(collection = "payments")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class Payment {

        @Id
        private String id;

        // 🔗 Relations
        private String bookingId;
        private String userId;
        private String ownerId;

        // 💰 Amount
        private double amount;

        // 🔑 Razorpay fields
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String razorpaySignature;

        // 📦 Full Razorpay response (JSON)
        private String razorpayResponse;

        // 📊 Status
        private String status;
        // CREATED, SUCCESS, FAILED

        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

