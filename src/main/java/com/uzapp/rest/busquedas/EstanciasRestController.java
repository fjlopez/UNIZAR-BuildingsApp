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

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/estancias")
public class EstanciasRestController {
	
	private static final Logger logger = LoggerFactory.getLogger(EstanciasRestController.class);
	
	@RequestMapping(
			value = "/id_estancia", 
			method = RequestMethod.GET,
			produces = "application/json")
	public String infoEstancia(@RequestParam("estancia") String estancia){
		logger.info("Servicio: infoEstancia()");
		Connection connection = ConnectionManager.getConnection();
		Gson gson = new Gson();
		String query = "Select distinct \"ID_ESPACIO\" ,\"ID_CENTRO\" from \"TB_ESPACIOS\" WHERE \"ID_ESPACIO\" = '"+estancia+"'";
		System.out.println(query);
		Espacios resultado;
		try {
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			if (respuesta.next()){
				resultado=new Espacios(respuesta.getString("ID_ESPACIO"),respuesta.getString("ID_CENTRO"));
				System.out.println("resultado"+gson.toJson(resultado));
				return gson.toJson(resultado);
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "";
	}
	
	@RequestMapping(
			value = "/getEstancia", 
			method = RequestMethod.GET,
			produces = "application/json")
	public String getEstancia(@RequestParam("estancia") String estancia){
		logger.info("Servicio: infoEstancia()");
		Connection connection = ConnectionManager.getConnection();
		Gson gson = new Gson();
		String query = "Select distinct \"A\".\"ID_ESPACIO\" ,\"A\".\"ID_CENTRO\", \"B\".\"TIPO_DE_USO\", round(\"A\".\"SUPERFICIE\",2) AS \"SUPERFICIE\" from \"TB_ESPACIOS\" \"A\",\"TB_TIPO_DE_USO\" \"B\"  WHERE \"A\".\"TIPO_DE_USO\" = \"B\".ID AND \"A\".\"ID_ESPACIO\" = '"+estancia+"' ";
		System.out.println(query);
		Espacios resultado;
		try {
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			if (respuesta.next()){
				resultado=new Espacios(respuesta.getString("ID_ESPACIO"),respuesta.getString("ID_CENTRO"),respuesta.getString("TIPO_DE_USO"),respuesta.getString("SUPERFICIE"));
				System.out.println("resultado"+gson.toJson(resultado));
				return gson.toJson(resultado);
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "";
	}
	
	@RequestMapping(
			value = "/getAllEstancias", 
			method = RequestMethod.GET,
			produces = "application/json")
	public String getAllEstancias(@RequestParam("estancia") String espacio){
		logger.info("Servicio: infoEstancia()");
		Connection connection = ConnectionManager.getConnection();
		Gson gson = new Gson();
		String query = "Select distinct \"ID_ESPACIO\" ,\"ID_CENTRO\" from \"TB_ESPACIOS\" WHERE \"ID_ESPACIO\" LIKE '%"+espacio+ "%'  ORDER BY \"ID_CENTRO\" ASC";
		System.out.println(query);
		List<Espacios> resultado = new ArrayList<Espacios>();
		try {
			ResultSet respuesta = connection.prepareStatement(query).executeQuery();

			while (respuesta.next()){
				resultado.add(new Espacios(respuesta.getString("ID_ESPACIO"),respuesta.getString("ID_CENTRO")));
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return gson.toJson(resultado);
	}
}
