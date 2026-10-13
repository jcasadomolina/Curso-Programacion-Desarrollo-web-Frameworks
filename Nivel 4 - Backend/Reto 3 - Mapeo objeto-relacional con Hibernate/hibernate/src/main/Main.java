package com.reto3.modelo;

import com.reto3.modelo.Usuario;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class Main {
    public static void main(String[] args) {
        // 1. Configurar y construir la SessionFactory
        SessionFactory sessionFactory = new Configuration()
                .configure("hibernate.cfg.xml")
                .addAnnotatedClass(Usuario.class)
                .buildSessionFactory();

        // 2. Abrir sesión
        Session session = sessionFactory.openSession();

        try {
            // 3. Iniciar transacción
            session.beginTransaction();

            // 4. Crear un objeto y guardarlo
            Usuario nuevoUsuario = new Usuario("Ana García", "ana@email.com");
            session.persist(nuevoUsuario);

            // 5. Confirmar transacción
            session.getTransaction().commit();
            System.out.println("Usuario guardado con éxito.");
            
        } catch (Exception e) {
            if (session.getTransaction() != null) {
                session.getTransaction().rollback(); // Deshacer en caso de error
            }
            e.printStackTrace();
        } finally {
            session.close();
            sessionFactory.close();
        }
    }
}