package com.dwelldiscover.HostelServer.controller;

import com.dwelldiscover.HostelServer.dto.DashboardSummaryDTO;
import com.dwelldiscover.HostelServer.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardSummaryDTO getSummary() {
        return dashboardService.getDashboardSummary();
    }
}
