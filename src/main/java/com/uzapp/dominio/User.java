package com.uzapp.dominio;

import java.sql.Date;

public class User {

    private int id;
    private String username;
    private String password;
    private String email;
    private String name;
    private String surnames;
    private Date birthDate;
    private String role;

    public User() {}

    public User(String username, String password, String email, String name, String surnames, Date birthDate, String role){
        this.username=username;
        this.password=password;
        this.email=email;
        this.name=name;
        this.surnames=surnames;
        this.birthDate=birthDate;
        this.role = role;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUsername() { return this.username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return this.password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return this.name; }
    public void setName(String name) { this.name = name; }

    public String getSurnames() { return this.surnames; }
    public void setSurnames(String surnames) { this.surnames = surnames; }

    public Date getBirthDate() { return this.birthDate; }
    public void setBirthDate(Date birthDate) { this.birthDate = birthDate; }

    public String getRole() { return this.role; }
    public void setRole(String role) { this.role = role; }
}