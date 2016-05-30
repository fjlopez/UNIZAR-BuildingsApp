package com.uzapp.dominio;

public class Campus {
	
private int ID;	
private String campus;

	public Campus(int ID,String campus){
		this.ID=ID;
		this.campus=campus;
	}

	public String getCampus() {
		return campus;
	}

	public void setCampus(String campus) {
		this.campus = campus;
	}

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

}
