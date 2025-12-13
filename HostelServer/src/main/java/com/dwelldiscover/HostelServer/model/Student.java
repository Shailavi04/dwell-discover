package com.dwelldiscover.HostelServer.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
@Data
public class Student {

    @Id
    private String id;

    private String userId;  // Reference to User collection

    private boolean verified = false;

    private String gender;
    private String phone;
    private String city;
    private String profileImage; // Optional
}
