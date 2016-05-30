package com.uzapp.rest.busquedas;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.google.gson.Gson;
import com.uzapp.bd.ConnectionManager;
import com.uzapp.dominio.Campus;
import com.uzapp.dominio.Edificio;
import com.uzapp.dominio.Espacios;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/busquedas")
public class BusquedasRestController {
	
	private static final Logger logger = LoggerFactory.getLogger(BusquedasRestController.class);
	
	@RequestMapping(
			value = "/codigoespacios", 
			method = RequestMethod.GET,
			produces = "application/json")
	public String codigoEspacios(){
		logger.info("Servicio: codigoEspacios()");
		Connection connection = ConnectionManager.getConnection();
		Gson gson = new Gson();
		String query = "Select distinct \"ID_ESPACIO\" from \"TB_ESPACIOS\" ORDER BY \"ID_ESPACIO\" ASC";
		List<Espacios> resultado = new ArrayList<Espacios>();
		try {
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			while (respuesta.next()){
				resultado.add(new Espacios(respuesta.getString("ID_ESPACIO")));
			}
			//System.out.println("resultado"+gson.toJson(resultado));
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return gson.toJson(resultado);
	}
	
	@RequestMapping(
			value = "/campus", 
			method = RequestMethod.GET,
			produces = "application/json")
	public String campus(@RequestParam("ciudad") String ciudad){
		logger.info("Servicio: campus()");
		Connection connection = ConnectionManager.getConnection();
		Gson gson = new Gson();
		String query = "Select distinct \"ID\" , \"CAMPUS\" from \"TB_CODIGOS_DE_CAMPUS\" WHERE \"CIUDAD\" = "+ciudad+" ORDER BY \"CAMPUS\" ASC";
		System.out.println(query);
		List<Campus> resultado = new ArrayList<Campus>();
		try {
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			while (respuesta.next()){
				resultado.add(new Campus(respuesta.getInt("ID"),respuesta.getString("CAMPUS")));
			}
			System.out.println("resultado"+gson.toJson(resultado));
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return gson.toJson(resultado);
	}
	
	@RequestMapping(
			value = "/edificio", 
			method = RequestMethod.GET,
			produces = "application/json")
	public String edificio(@RequestParam("campus") String campus){
		logger.info("Servicio: edificio()");
		Connection connection = ConnectionManager.getConnection();
		Gson gson = new Gson();
		String query = "Select distinct \"ID_EDIFICIO\" , \"EDIFICIO\", \"DIRECCION\" from \"TB_EDIFICIOS\" WHERE \"CAMPUS\" = "+campus +" ORDER BY \"EDIFICIO\" ASC";
		System.out.println(query);
		List<Edificio> resultado = new ArrayList<Edificio>();
		try {
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			while (respuesta.next()){
				String ID_Edificio= respuesta.getString("ID_EDIFICIO");
				resultado.add(new Edificio(ID_Edificio,respuesta.getString("EDIFICIO"),respuesta.getString("DIRECCION"),obtenerPlantasEdificio(connection,ID_Edificio)));
			}
			System.out.println("resultado"+gson.toJson(resultado));
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return gson.toJson(resultado);
	}
	
	@RequestMapping(
			value = "/infoedificio", 
			method = RequestMethod.GET,
			produces = "application/json")
	public String infoEdificio(@RequestParam("edificio") String edificio){
		logger.info("Servicio: edificio()");
		Connection connection = ConnectionManager.getConnection();
		Gson gson = new Gson();
		String query = "Select distinct \"ID_EDIFICIO\" , \"EDIFICIO\", \"DIRECCION\" from \"TB_EDIFICIOS\" WHERE \"ID_EDIFICIO\" = '"+edificio+"'";
		System.out.println(query);
		List<Edificio> resultado = new ArrayList<Edificio>();
		try {
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			while (respuesta.next()){
				String ID_Edificio= respuesta.getString("ID_EDIFICIO");
				resultado.add(new Edificio(ID_Edificio,respuesta.getString("EDIFICIO"),respuesta.getString("DIRECCION"),obtenerPlantasEdificio(connection,ID_Edificio)));
			}
			System.out.println("resultado"+gson.toJson(resultado));
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return gson.toJson(resultado);
	}
	
	private static List<String> obtenerPlantasEdificio(Connection connection,String ID_EDIFICIO){
		String query = "select distinct SUBSTRING(\"ID_UTC\",1,2) as \"Pisos\" from \"TB_ESPACIOS\" where \"ID_EDIFICIO\" = '" + ID_EDIFICIO +"' ORDER BY \"Pisos\" ASC";
		List<String> plantas = new ArrayList<String>();
		try {
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			while (respuesta.next()){

				plantas.add(respuesta.getString("Pisos"));
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return plantas;
	}
}
