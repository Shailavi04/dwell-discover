package com.dwelldiscover.HostelServer.dto;

public class UserSplitDTO {
    private long students;
    private long owners;
    private long total;

    public UserSplitDTO(long students, long owners) {
        this.students = students;
        this.owners = owners;
        this.total = students + owners;
    }

    public long getStudents() { return students; }
    public long getOwners() { return owners; }
    public long getTotal() { return total; }
}
