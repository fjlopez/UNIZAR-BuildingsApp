package com.uzapp.bd;

import java.io.*;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

import javax.naming.Context;

import org.apache.tomcat.jdbc.pool.DataSource;
import org.apache.tomcat.jdbc.pool.PoolProperties;

public class ConnectionManager {
	
	static Context initContext;
	private final static String DRIVER_CLASS_NAME = "org.postgresql.Driver";
	private static DataSource datasource ;

	static {
		try {
			Class.forName(DRIVER_CLASS_NAME);

			InputStream input = ConnectionManager.class.getClassLoader().getResourceAsStream("config.properties");
			Properties prop = new Properties();
			prop.load(input);

			PoolProperties p = new PoolProperties();
			p.setUrl("jdbc:postgresql://"+prop.getProperty("dbhost")+"/"+prop.getProperty("db"));
			p.setDriverClassName("org.postgresql.Driver");
			p.setUsername(prop.getProperty("dbuser"));
			p.setPassword(prop.getProperty("dbpassword"));
			p.setJmxEnabled(true);
			p.setTestWhileIdle(false);
			p.setTestOnBorrow(true);
			p.setValidationQuery("SELECT 1");
			p.setTestOnReturn(false);
			p.setValidationInterval(30000);
			p.setTimeBetweenEvictionRunsMillis(30000);
			p.setMaxActive(100);
			p.setInitialSize(10);
			p.setMaxWait(5000);
			p.setMaxIdle(30);
			p.setRemoveAbandonedTimeout(300);
			p.setMinEvictableIdleTimeMillis(30000);
			p.setMinIdle(10);
			p.setLogAbandoned(true);
			p.setRemoveAbandoned(true);
			p.setJdbcInterceptors(
				"org.apache.tomcat.jdbc.pool.interceptor.ConnectionState;"+
				"org.apache.tomcat.jdbc.pool.interceptor.StatementFinalizer;"+
				"org.apache.tomcat.jdbc.pool.interceptor.ResetAbandonedTimer");

			datasource = new DataSource();
			datasource.setPoolProperties(p);

		} catch (ClassNotFoundException e) {
			e.printStackTrace(System.err);
		} catch (FileNotFoundException e) {
			e.printStackTrace(System.err);
		} catch (IOException e) {
			e.printStackTrace(System.err);
		}
	}
	

	public static Connection getConnection() {
		try {
			return datasource.getConnection();

		} catch (SQLException e) {
			System.out.println("Driver no encontrado."); 
			e.printStackTrace();
		}
		return null;
	}
	
	 /*// Pruebas de conexion
	  public static void main(String[] args){
		Connection c = ConnectionManager.getConnection();
		String queryString = "SELECT * FROM \"TB_ESPACIOS\"";    

        try {
			PreparedStatement preparedStatement = c.prepareStatement(queryString);
			ResultSet rs = preparedStatement.executeQuery();
			
			while(rs.next()){
				System.out.println("Espacio: "+rs.getString("ID_ESPACIO"));
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}*/
}