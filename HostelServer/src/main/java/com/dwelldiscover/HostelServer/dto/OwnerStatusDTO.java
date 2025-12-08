package com.dwelldiscover.HostelServer.dto;

public class OwnerStatusDTO {
    private String status;
    private long count;

    public OwnerStatusDTO(String status, long count) {
        this.status = status;
        this.count = count;
    }

    public String getStatus() { return status; }
    public long getCount() { return count; }
}
