package com.dwelldiscover.HostelServer.controller;

import com.dwelldiscover.HostelServer.dto.*;
import com.dwelldiscover.HostelServer.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin("*")
public class AnalyticsController {

    @Autowired
    AnalyticsService analyticsService;

    @GetMapping("/overview")
    public AnalyticsOverviewDTO overview() {
        return analyticsService.getOverview();
    }
    @GetMapping("/user-split")
    public UserSplitDTO getUserSplit() {
        return analyticsService.getUserSplit();
    }

    @GetMapping("/monthly-users")
    public List<TimeCountDTO> monthlyUsers() {
        return analyticsService.getMonthlyUsers();
    }

    @GetMapping("/monthly-rooms")
    public List<TimeCountDTO> monthlyRooms() {
        return analyticsService.getMonthlyRooms();
    }

    @GetMapping("/owner-status")
    public List<OwnerStatusDTO> ownerStatus() {
        return analyticsService.getOwnerStatus();
    }

    @GetMapping("/rooms-per-city")
    public List<TimeCountDTO> roomsPerCity() {
        return analyticsService.getRoomsPerCity();
    }
}
