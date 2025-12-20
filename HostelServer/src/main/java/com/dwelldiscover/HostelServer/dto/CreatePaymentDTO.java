package com.dwelldiscover.HostelServer.dto;

import lombok.Data;

@Data
public class CreatePaymentDTO {
    private String bookingId;

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }
}
