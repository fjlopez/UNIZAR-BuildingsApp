package com.uzapp.dominio;

public class POI {

    private int id;
    private String city;
    private String campus;
    private String building;
    private String roomId;
    private String roomName;
    private int floor;
    private String category;
    private String comments;
    private String address;
    private double latitude;
    private double longitude;
    private Boolean approved;
    private String email;

    public POI() {}

    public POI(String city, String campus, String building, String roomId, String roomName, int floor,
                String category, String comments, String address, double latitude, double longitude, String email){
        this.city=city;
        this.campus=campus;
        this.building=building;
        this.roomId=roomId;
        this.roomName=roomName;
        this.floor=floor;
        this.category=category;
        this.address=address;
        this.comments=comments;
        this.latitude=latitude;
        this.longitude=longitude;
        this.email=email;
    }

    public POI(int id, String city, String campus, String building, String roomId, String roomName, int floor,
                String category, String comments, String address, double latitude, double longitude, String email){
        this.id=id;
        this.city=city;
        this.campus=campus;
        this.building=building;
        this.roomId=roomId;
        this.roomName=roomName;
        this.floor=floor;
        this.category=category;
        this.address=address;
        this.comments=comments;
        this.latitude=latitude;
        this.longitude=longitude;
        this.email=email;
    }

    public POI(int id, String city, String campus, String building, String roomId, String roomName, int floor, String category,
                String comments, String address, double latitude, double longitude, Boolean approved, String email){
        this.id=id;
        this.city=city;
        this.campus=campus;
        this.building=building;
        this.roomId=roomId;
        this.roomName=roomName;
        this.floor=floor;
        this.category=category;
        this.address=address;
        this.comments=comments;
        this.latitude=latitude;
        this.longitude=longitude;
        this.approved=approved;
        this.email=email;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getCity() { return this.city; }
    public void setCity(String city) { this.city = city; }

    public String getCampus() { return this.campus; }
    public void setCampus(String campus) { this.campus = campus; }

    public String getBuilding() { return this.building; }
    public void setBuilding(String building) { this.building = building; }

    public String getRoomId() { return this.roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getRoomName() { return this.roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public int getFloor() { return this.floor; }
    public void setFloor(int floor) { this.floor = floor; }

    public String getCategory() { return this.category; }
    public void setCategory(String category) { this.category = category; }

    public String getComments() { return this.comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getAddress() { return this.address; }
    public void setAddress(String address) { this.address = address; }

    public Boolean getApproved() { return this.approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }

    public double getLatitude() { return this.latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return this.longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
}