package com.dwelldiscover.HostelServer.repository;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.aggregation.ConvertOperators;
import java.util.List;

@Repository
public class AnalyticsRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    // ------------------------------
    // 1️⃣ Monthly Users
    // ------------------------------
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

    // ------------------------------
    // 2️⃣ Monthly Rooms
    // ------------------------------
    public List<Document> monthlyRooms() {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.project()
                        .andExpression("month(createdAt)").as("month")
                        .andExpression("year(createdAt)").as("year"),
                Aggregation.group("year", "month").count().as("count"),
                Aggregation.sort(Sort.by(Sort.Direction.ASC, "_id.year", "_id.month"))
        );

        return mongoTemplate.aggregate(agg, "rooms", Document.class).getMappedResults();
    }

    // ------------------------------
    // 3️⃣ Rooms Per City (🔥 ONLY CORRECT VERSION)
    // ------------------------------

    public List<Document> roomsPerCity() {

        Aggregation agg = Aggregation.newAggregation(

                // 1️⃣ Convert propertyId (String) → ObjectId
                Aggregation.addFields()
                        .addField("propertyObjId")
                        .withValue(
                                ConvertOperators    .ToObjectId.toObjectId("$propertyId")
                        )
                        .build(),

                // 2️⃣ Lookup properties
                Aggregation.lookup(
                        "properties",
                        "propertyObjId",
                        "_id",
                        "property"
                ),

                // 3️⃣ Unwind property array
                Aggregation.unwind("property"),

                // 4️⃣ Group by city
                Aggregation.group("property.city")
                        .count().as("count"),

                // 5️⃣ Sort
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "count"))
        );

        return mongoTemplate
                .aggregate(agg, "rooms", Document.class)
                .getMappedResults();
    }

    // ------------------------------
    // 4️⃣ Owner Status
    // ------------------------------
    public List<Document> ownerStatus() {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.group("verified").count().as("count")
        );

        return mongoTemplate.aggregate(agg, "owners", Document.class).getMappedResults();
    }

}