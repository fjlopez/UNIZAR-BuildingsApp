package com.uzapp.dominio;

public class Espacios {
	
	private String ID_espacio;
	private String ID_centro;
	private String tipo_uso;
	private String superficie;
	
	public Espacios(String ID_espacio){
		this.ID_espacio=ID_espacio;
	}
	
	public Espacios(String ID_espacio,String ID_centro){
		this.ID_espacio=ID_espacio;
		this.ID_centro=ID_centro;
	}
	
	public Espacios(String ID_espacio,String ID_centro,String tipo_uso, String superficie){
		this.ID_espacio=ID_espacio;
		this.ID_centro=ID_centro;
		this.tipo_uso=tipo_uso;
		this.superficie=superficie;
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
}
