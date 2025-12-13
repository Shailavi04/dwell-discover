package com.dwelldiscover.HostelServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
// Jackson annotations
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection = "properties")
public class Property {

    @Id
    private String id;
    private String name;
    private String contact;
    private String owneruserId;   // ← Save which owner created it
    private String city;
    private String address;
    private String description;
    private boolean verified = false;


    public Property() {}

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getOwnerId() { return owneruserId; }
    public void setOwnerId(String ownerId) { this.owneruserId = ownerId; }

    @JsonProperty("owneruserId")
    public String getOwneruserId() { return owneruserId; }

    @JsonProperty("owneruserId")
    public void setOwneruserId(String owneruserId) { this.owneruserId = owneruserId; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
