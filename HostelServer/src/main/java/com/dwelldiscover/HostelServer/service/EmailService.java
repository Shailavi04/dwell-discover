package com.dwelldiscover.HostelServer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Your OTP Code | Dwell Discover");
        message.setText(
                "Dear User,\n\n" +
                        "Your OTP code is: " + otp + "\n" +
                        "It is valid for the next 10 minutes.\n\n" +
                        "Thank you,\nDwell Discover Team"
        );

        mailSender.send(message);
    }
}
