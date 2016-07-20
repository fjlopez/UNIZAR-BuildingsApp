package com.uzapp.dominio;

public class Espacios {
	
	private String ID_espacio;
	private String ID_centro;
	private String tipo_uso;
	private String superficie;
	private String edificio;
	private String dir;
	private String ciudad;
	private String campus;
	
	public Espacios(String ID_espacio){
		this.ID_espacio=ID_espacio;
	}
	
	public Espacios(String ID_espacio, String ID_centro){
		this.ID_espacio = ID_espacio;
		this.ID_centro = ID_centro;
	}
	
	public Espacios(String ID_espacio, String ID_centro, String tipo_uso, String superficie){
		this.ID_espacio=ID_espacio;
		this.ID_centro=ID_centro;
		this.tipo_uso=tipo_uso;
		this.superficie=superficie;
	}

	public Espacios(String ID_espacio, String ID_centro, String edificio, String dir, String ciudad, String campus){
		this.ID_espacio = ID_espacio;
		this.ID_centro = ID_centro;
		this.edificio = edificio;
		this.dir = dir;
		this.ciudad = ciudad;
		this.campus = campus;
	}

	public String getTipo_uso() {
		return tipo_uso;
	}

	public void setTipo_uso(String tipo_uso) {
		this.tipo_uso = tipo_uso;
	}

	public String getSuperficie() {
		return superficie;
	}

	public void setSuperficie(String superficie) {
		this.superficie = superficie;
	}

	public String getID_centro() {
		return ID_centro;
	}

	public void setID_centro(String iD_centro) {
		ID_centro = iD_centro;
	}

	public String getID_espacio() {
		return ID_espacio;
	}

	public void setID_espacio(String iD_espacio) {
		ID_espacio = iD_espacio;
	}

	public String getEdificio() {
		return edificio;
	}

	public void setEdificio(String edificio) {
		edificio = edificio;
	}

	public String getDir() {
		return dir;
	}

	public void setDir(String dir) {
		dir = dir;
	}

	public String getCiudad() {
		return ciudad;
	}

	public void setCiudad(String ciudad) {
		ciudad = ciudad;
	}

	public String getCampus() {
		return campus;
	}

	public void setCampus(String campus) {
		campus = campus;
	}
}
