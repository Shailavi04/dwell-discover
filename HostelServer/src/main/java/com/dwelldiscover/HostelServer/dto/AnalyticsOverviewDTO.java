package com.dwelldiscover.HostelServer.dto;

public class AnalyticsOverviewDTO {

    private long totalUsers;
    private long totalOwners;
    private long totalRooms;
    private long pendingOwners;
    private long verifiedOwners;
    private long totalCities;
    private long reportedRooms;

    public AnalyticsOverviewDTO(long totalUsers, long totalOwners, long totalRooms,
                                long pendingOwners, long verifiedOwners,
                                long totalCities, long reportedRooms) {
        this.totalRooms = totalRooms;
        this.pendingOwners = pendingOwners;
        this.verifiedOwners = verifiedOwners;
        this.totalCities = totalCities;
        this.reportedRooms = reportedRooms;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalOwners() { return totalOwners; }
    public long getTotalRooms() { return totalRooms; }
    public long getPendingOwners() { return pendingOwners; }
    public long getVerifiedOwners() { return verifiedOwners; }
    public long getTotalCities() { return totalCities; }
    public long getReportedRooms() { return reportedRooms; }
}
