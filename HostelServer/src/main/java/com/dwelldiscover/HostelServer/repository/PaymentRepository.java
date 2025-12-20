package com.dwelldiscover.HostelServer.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.dwelldiscover.HostelServer.model.Payment;
import org.springframework.data.mongodb.repository.Query;
import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByRazorpayOrderId(String orderId);
}
