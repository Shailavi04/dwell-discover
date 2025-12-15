package com.dwelldiscover.HostelServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Date;

@Document(collection = "userreports")
public class UserReport {

    @Id
    private String id;

    private String reportedEntityId; // userId / roomId / propertyId
    private String entityType;       // "USER", "ROOM", etc.
    private String reportedByEmail;
    private String reason;
    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean resolved = false;

    // ------ Getters & Setters ------
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReportedEntityId() { return reportedEntityId; }
    public void setReportedEntityId(String reportedEntityId) { this.reportedEntityId = reportedEntityId; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getReportedByEmail() { return reportedByEmail; }
    public void setReportedByEmail(String reportedByEmail) { this.reportedByEmail = reportedByEmail; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isResolved() { return resolved; }
    public void setResolved(boolean resolved) { this.resolved = resolved; }
}
