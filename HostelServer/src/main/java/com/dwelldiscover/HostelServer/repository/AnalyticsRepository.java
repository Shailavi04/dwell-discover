package com.dwelldiscover.HostelServer.repository;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;

import java.util.List;

@Repository
public class AnalyticsRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    // -------------------------------------------------
    // 1️⃣ Monthly Users (OK)
    // -------------------------------------------------
    public List<Document> monthlyUsers() {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.project()
                        .andExpression("month(createdAt)").as("month")
                        .andExpression("year(createdAt)").as("year"),

                Aggregation.group("year", "month").count().as("count"),

                Aggregation.sort(Sort.by(Sort.Direction.ASC, "_id.year", "_id.month"))
        );

        return mongoTemplate.aggregate(agg, "users", Document.class).getMappedResults();
    }


    // -------------------------------------------------
    // 2️⃣ Monthly Rooms (FIXED: createdAt not mandatory → fallback)
    // -------------------------------------------------
    public List<Document> monthlyRooms() {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.project()
                        .andExpression("month(createdAt != null ? createdAt : new Date())").as("month")
                        .andExpression("year(createdAt != null ? createdAt : new Date())").as("year"),

                Aggregation.group("year", "month").count().as("count"),

                Aggregation.sort(Sort.by(Sort.Direction.ASC, "_id.year", "_id.month"))
        );

        return mongoTemplate.aggregate(agg, "rooms", Document.class).getMappedResults();
    }


    // -------------------------------------------------
    // 3️⃣ Rooms Per City (OK)
    // -------------------------------------------------
    public List<Document> roomsPerCity() {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.group("city").count().as("count"),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "count"))
        );

        return mongoTemplate.aggregate(agg, "rooms", Document.class).getMappedResults();
    }


    // -------------------------------------------------
    // 4️⃣ Owner Verified Status Count (FULLY FIXED)
    // -------------------------------------------------
    public List<Document> ownerStatus() {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.group("verified").count().as("count")
        );

        return mongoTemplate.aggregate(agg, "owners", Document.class).getMappedResults();
    }
}
