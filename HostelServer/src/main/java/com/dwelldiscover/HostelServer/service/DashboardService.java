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

        DashboardSummaryDTO dto = new DashboardSummaryDTO();

        dto.setTotalUsers(userRepo.count());
        dto.setTotalOwners(ownerRepo.count());
        dto.setPendingOwners(ownerRepo.countByVerified(false));
        dto.setTotalRooms(roomRepo.count());
        dto.setTotalProperties(propertyRepo.count());

        return dto;
    }
}
