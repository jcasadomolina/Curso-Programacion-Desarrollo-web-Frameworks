package com.reto3;

import com.reto3.Usuario;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

public class UsuarioDAO {
    
    private SessionFactory sessionFactory;

    public UsuarioDAO() {
        sessionFactory = new Configuration().configure().addAnnotatedClass(Usuario.class).buildSessionFactory();
    }

    // CREATE
    public void guardarUsuario(Usuario usuario) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            session.persist(usuario);
            tx.commit();
        }
    }

    // READ
    public Usuario obtenerUsuario(Long id) {
        try (Session session = sessionFactory.openSession()) {
            return session.get(Usuario.class, id);
        }
    }

    // UPDATE
    public void actualizarUsuario(Usuario usuario) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            session.merge(usuario);
            tx.commit();
        }
    }

    // DELETE
    public void eliminarUsuario(Long id) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            Usuario usuario = session.get(Usuario.class, id);
            if (usuario != null) {
                session.remove(usuario);
            }
            tx.commit();
        }
    }
}