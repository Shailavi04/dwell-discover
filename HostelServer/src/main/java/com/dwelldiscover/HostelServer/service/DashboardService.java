package com.dwelldiscover.HostelServer.service;

import com.dwelldiscover.HostelServer.dto.DashboardSummaryDTO;
import com.dwelldiscover.HostelServer.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private OwnerRepository ownerRepo;

    @Autowired
    private RoomRepository roomRepo;

    @Autowired
    private PropertyRepository propertyRepo;

    public DashboardSummaryDTO getDashboardSummary() {

        long totalUsers = userRepo.count();
        long totalRooms = roomRepo.count();
        long totalProperties = propertyRepo.count();
        long pendingOwners = ownerRepo.countByVerified(false);

        // 🔹 TEMP DATA (SAFE – frontend crash nahi hoga)
        int newUsersThisWeek = 8;
        int roomsAddedThisWeek = 4;
        int ownersRegisteredThisWeek = 2;

        int weeklyGrowth = newUsersThisWeek > 0 ? 20 : 0;
        boolean systemHealthy = true;

        return new DashboardSummaryDTO(
                totalUsers,
                pendingOwners,
                totalRooms,
                totalProperties,
                weeklyGrowth,
                newUsersThisWeek,
                roomsAddedThisWeek,
                ownersRegisteredThisWeek,
                systemHealthy
        );
    }
}
