package com.dwelldiscover.HostelServer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryDTO {

    private long totalUsers;
    private long pendingOwners;
    private long totalRooms;
    private long totalProperties;

    private int weeklyGrowth;
    private int newUsers;
    private int roomsAdded;
    private int ownersRegistered;

    private boolean systemHealthy;
}
