package com.uzapp.dominio;

import java.util.List;

public class Edificio {
	
	private String ID_Edificio;	
	private String edificio;//nombre del edificio
	private String direccion;
	private List<String> plantas;//Especifica las distintas plantas que tiene un edificio

		public Edificio(String ID,String edificio,String direccion,List<String> plantas){
			this.ID_Edificio=ID;
			this.edificio=edificio;
			this.plantas=plantas;
			this.direccion=direccion;
		}

		public String getCampus() {
			return edificio;
		}

		public void setCampus(String campus) {
			this.edificio = campus;
		}

		public String getID() {
			return ID_Edificio;
		}

		public void setID(String iD) {
			ID_Edificio = iD;
		}

		public List<String> getPlantas() {
			return plantas;
		}

		public void setPlantas(List<String> plantas) {
			this.plantas = plantas;
		}

		public String getDireccion() {
			return direccion;
		}

		public void setDireccion(String direccion) {
			this.direccion = direccion;
		}
}
