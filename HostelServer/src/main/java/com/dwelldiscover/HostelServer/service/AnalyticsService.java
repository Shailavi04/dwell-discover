package com.dwelldiscover.HostelServer.service;

import com.dwelldiscover.HostelServer.dto.*;
import com.dwelldiscover.HostelServer.model.Property;
import com.dwelldiscover.HostelServer.repository.*;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class AnalyticsService {

    @Autowired
    UserRepository userRepo;

    @Autowired
    OwnerRepository ownerRepo;

    @Autowired
    RoomRepository roomRepo;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    AnalyticsRepository analyticsRepo;

    public AnalyticsOverviewDTO getOverview() {

        long totalUsers = userRepo.count();
        long totalOwners = ownerRepo.count();
        long totalRooms = roomRepo.count();
        long pendingOwners = ownerRepo.countByVerified(false);
        long verifiedOwners = ownerRepo.countByVerified(true);

        // <-- fixed: compute distinct cities from properties (keeps your original logic intact)
        long totalCities = propertyRepository.findAllCities()
                .stream()
                .map(Property::getCity)
                .filter(Objects::nonNull)
                .distinct()
                .count();

        long reportedRooms = roomRepo.countByReported(true);

        return new AnalyticsOverviewDTO(
                totalUsers,
                totalOwners,
                totalRooms,
                pendingOwners,
                verifiedOwners,
                totalCities,
                reportedRooms
        );
    }

    public List<TimeCountDTO> getMonthlyUsers() {
        return analyticsRepo.monthlyUsers()
                .stream()
                .map(d -> {
                    Document id = (Document) d.get("_id");

                    Number month = id.get("month", Number.class);
                    Number year = id.get("year", Number.class);
                    Number countNum = d.get("count", Number.class);

                    String label = year.intValue() + "-" + String.format("%02d", month.intValue());

                    return new TimeCountDTO(label, countNum.longValue());
                })
                .toList();
    }

    public List<TimeCountDTO> getMonthlyRooms() {
        return analyticsRepo.monthlyRooms()
                .stream()
                .map(d -> {
                    Document id = (Document) d.get("_id");

                    Number month = id.get("month", Number.class);
                    Number year = id.get("year", Number.class);
                    Number countNum = d.get("count", Number.class);

                    String label = year.intValue() + "-" + String.format("%02d", month.intValue());

                    return new TimeCountDTO(label, countNum.longValue());
                })
                .toList();
    }

    public List<OwnerStatusDTO> getOwnerStatus() {
        return analyticsRepo.ownerStatus()
                .stream()
                .map(d -> {
                    Boolean verified = (Boolean) d.get("_id");
                    String status = verified ? "Verified" : "Unverified";
                    Number countNum = d.get("count", Number.class);
                    return new OwnerStatusDTO(status, countNum.longValue());
                })
                .toList();
    }
    public List<TimeCountDTO> getRoomsPerCity() {
        return analyticsRepo.roomsPerCity()
                .stream()
                .filter(d -> d.get("_id") != null) // SAFETY
                .map(d -> {
                    String city = d.get("_id", String.class);
                    Number countNum = d.get("count", Number.class);
                    return new TimeCountDTO(city, countNum.longValue());
                })
                .toList();
    }
}
