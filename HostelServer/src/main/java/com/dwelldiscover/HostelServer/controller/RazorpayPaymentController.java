package com.dwelldiscover.HostelServer.controller;

import com.dwelldiscover.HostelServer.dto.CreatePaymentDTO;
import com.dwelldiscover.HostelServer.model.Payment;
import com.dwelldiscover.HostelServer.repository.PaymentRepository;
import com.dwelldiscover.HostelServer.service.BookingService;
import org.springframework.security.core.userdetails.UserDetails;
import com.dwelldiscover.HostelServer.model.Booking;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.*;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class RazorpayPaymentController {

    private final PaymentRepository paymentRepo;
    private final BookingService bookingService;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public RazorpayPaymentController(
            PaymentRepository paymentRepo,
            BookingService bookingService
    ) {
        this.paymentRepo = paymentRepo;
        this.bookingService = bookingService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody CreatePaymentDTO req
    ) throws RazorpayException {

        System.out.println("🔥 CREATE ORDER API HIT");

        Booking booking = bookingService.getBookingById(req.getBookingId());

        double amount = booking.getTotalAmount();
        System.out.println("💰 FINAL AMOUNT = " + amount);

        if (amount <= 0) {
            throw new RuntimeException("Invalid booking amount");
        }

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        long amountInPaise = Math.round(amount * 100);

        JSONObject orderReq = new JSONObject();
        orderReq.put("amount", amountInPaise);   // ✅ NO ERROR
        orderReq.put("currency", "INR");
        orderReq.put("receipt", "rcpt_" + System.currentTimeMillis());

        Order order = client.orders.create(orderReq);

        Payment payment = new Payment();
        payment.setBookingId(booking.getId());
        payment.setUserId(booking.getUserId());
        payment.setAmount(amount); // ✅ double → double
        payment.setRazorpayOrderId(order.get("id"));
        payment.setStatus("CREATED");
        payment.setCreatedAt(LocalDateTime.now());

        paymentRepo.save(payment);

        return ResponseEntity.ok(order.toString());
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody Map<String, Object> data
    ) throws Exception {

        String orderId = data.get("razorpay_order_id").toString();
        String paymentId = data.get("razorpay_payment_id").toString();
        String signature = data.get("razorpay_signature").toString();

        Payment payment = paymentRepo
                .findByRazorpayOrderId(orderId)
                .orElseThrow();

        String generatedSignature = Utils.getHash(
                orderId + "|" + paymentId,
                keySecret
        );

        if (!generatedSignature.equals(signature)) {
            payment.setStatus("FAILED");
            paymentRepo.save(payment);
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        payment.setRazorpayPaymentId(paymentId);
        payment.setRazorpaySignature(signature);
        payment.setRazorpayResponse(
                new ObjectMapper().writeValueAsString(data)
        );
        payment.setStatus("SUCCESS");
        payment.setUpdatedAt(LocalDateTime.now());

        paymentRepo.save(payment);
        bookingService.confirmBooking(payment.getBookingId());

        return ResponseEntity.ok("Payment verified");
    }
}
