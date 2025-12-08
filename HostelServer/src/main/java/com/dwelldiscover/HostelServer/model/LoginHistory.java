package com.dwelldiscover.HostelServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "login_history")
public class LoginHistory {

    @Id
    private String id;

    private String userEmail;
    private Date timestamp;
    private String ip;
    private String userAgent;
    private boolean success;

    // 🔹 No-args constructor (required by Spring)
    public LoginHistory() {}

    // 🔹 Full constructor (this is what AuthController needs)
    public LoginHistory(String id, String userEmail, Date timestamp,
                        String ip, String userAgent, boolean success) {
        this.id = id;
        this.userEmail = userEmail;
        this.timestamp = timestamp;
        this.ip = ip;
        this.userAgent = userAgent;
        this.success = success;
    }

    // 🔹 Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}
