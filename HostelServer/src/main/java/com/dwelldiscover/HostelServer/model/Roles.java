package com.dwelldiscover.HostelServer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "roles")
public class Roles {

    @Id
    private Integer id;
    private String name;
    private List<String> permissions;

    public Roles() {}

    public Roles(Integer id, String name, List<String> permissions) {
        this.id = id;
        this.name = name;
        this.permissions = permissions;
    }

    // getters + setters below...
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<String> getPermissions() { return permissions; }
    public void setPermissions(List<String> permissions) { this.permissions = permissions; }

}
