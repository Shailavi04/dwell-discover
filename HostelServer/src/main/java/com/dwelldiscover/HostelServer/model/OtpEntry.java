package com.dwelldiscover.HostelServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "otp_entries")
public class OtpEntry {

    @Id
    private String id;

    private String email;
    private String otp;
    private long expiryTime;

    public OtpEntry(String email, String otp, long expiryTime) {
        this.email = email;
        this.otp = otp;
        this.expiryTime = expiryTime;
    }

    public String getEmail() { return email; }
    public String getOtp() { return otp; }
    public long getExpiryTime() { return expiryTime; }
}
