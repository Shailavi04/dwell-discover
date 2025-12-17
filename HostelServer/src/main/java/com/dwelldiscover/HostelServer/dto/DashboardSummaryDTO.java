package com.dwelldiscover.HostelServer.dto;

import lombok.Data;

@Data
public class DashboardSummaryDTO {

    private long totalUsers;
    private long totalOwners;
    private long pendingOwners;
    private long totalRooms;
    private long totalProperties;

}
