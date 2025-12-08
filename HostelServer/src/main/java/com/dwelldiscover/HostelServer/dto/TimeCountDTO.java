package com.dwelldiscover.HostelServer.dto;

public class TimeCountDTO {
    private String label;
    private long count;

    public TimeCountDTO(String label, long count) {
        this.label = label;
        this.count = count;
    }

    public String getLabel() { return label; }
    public long getCount() { return count; }
}
