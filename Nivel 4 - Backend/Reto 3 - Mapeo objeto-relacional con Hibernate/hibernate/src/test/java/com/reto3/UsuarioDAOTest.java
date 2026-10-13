package com.reto3;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UsuarioDAOTest {

    private UsuarioDAO usuarioDAO;

    @BeforeEach
    void setUp() {
        usuarioDAO = new UsuarioDAO();
    }

    @Test
    void testOperacionesCRUD() {
        // 1. Test CREATE
        Usuario nuevoUsuario = new Usuario("Juan Perez", "juan@email.com");
        usuarioDAO.guardarUsuario(nuevoUsuario);
        assertNotNull(nuevoUsuario.getId(), "El ID no debería ser nulo tras guardar");

        // 2. Test READ
        Usuario usuarioRecuperado = usuarioDAO.obtenerUsuario(nuevoUsuario.getId());
        assertNotNull(usuarioRecuperado);
        assertEquals("Juan Perez", usuarioRecuperado.getNombre());

        // 3. Test UPDATE
        usuarioRecuperado.setNombre("Juan Modificado");
        usuarioDAO.actualizarUsuario(usuarioRecuperado);
        
        Usuario usuarioActualizado = usuarioDAO.obtenerUsuario(nuevoUsuario.getId());
        assertEquals("Juan Modificado", usuarioActualizado.getNombre());

        // 4. Test DELETE
        usuarioDAO.eliminarUsuario(usuarioActualizado.getId());
        Usuario usuarioBorrado = usuarioDAO.obtenerUsuario(usuarioActualizado.getId());
        assertNull(usuarioBorrado, "El usuario debería ser nulo tras eliminarlo");
    }
}