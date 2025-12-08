package com.dwelldiscover.HostelServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import java.util.Date;


@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;
    private String email;
    private String password;

    @DBRef
    private Roles role; // ✅ Reference to roles collection
    @CreatedDate
    private Date createdAt;
    private boolean isBlocked = false;
    private Date lastLoginAt;
    private boolean verified = false;



    // 🧱 Constructors
    public User() {}

    public User(String name, String email, String password, Roles role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // 🧠 Getters and Setters
    public String getId() { return id; }

    public void setId(String id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public Roles getRole() { return role; }

    public void setRole(Roles role) { this.role = role; }
    public boolean isBlocked() { return isBlocked; }
    public void setBlocked(boolean blocked) { isBlocked = blocked; }

    public Date getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(Date lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }



    // ✅ Fix this method (used in AuthService.login)
    public String getUsername() {
        return this.email; // 👈 Since your app uses email as username
    }
}
