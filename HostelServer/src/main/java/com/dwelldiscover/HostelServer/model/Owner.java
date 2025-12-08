package com.dwelldiscover.HostelServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "owners")
public class Owner {

    @Id
    private String id;

    private String userId; // Reference to Users collection

    private boolean verified = false;

    private List<String> documents = new ArrayList<>();

    private String businessName;
    private String address;
    private String city;
    private boolean isReported = false;

    private Date updatedAt = new Date();


    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public List<String> getDocuments() { return documents; }
    public void setDocuments(List<String> documents) { this.documents = documents; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
