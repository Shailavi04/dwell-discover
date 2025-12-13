package com.dwelldiscover.HostelServer.dto;

public class PropertyDTO {

    private String id;
    private String name;
    private String contact;
    private String city;
    private String address;
    private String description;
    private boolean verified;

    private String owneruserId;   // <-- CORRECT field name

    private String ownerName;
    private String ownerEmail;

    // getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getOwnerId() { return owneruserId; }
    public void setOwnerId(String owneruserId) { this.owneruserId = owneruserId; }

    public String getOwneruserId() {
        return owneruserId;
    }

    public void setOwneruserId(String owneruserId) {
        this.owneruserId = owneruserId;
    }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
}
