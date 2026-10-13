import { useEffect, useState } from 'react';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    fetch('http://localhost:3000/api/usuarios')
      .then(res => res.json())
      .then(datos => {
        if (datos.exito) setUsuarios(datos.usuarios);
      });
  };

  // Función para enviar el nuevo usuario
  const agregarUsuario = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevoNombre, rol: "User" })
    })
    .then(res => res.json())
    .then(datos => {
      if (datos.exito) {
        cargarUsuarios();
        setNuevoNombre("");
      }
    });
  };

  const eliminarUsuario = (id) => {
    // Añadimos el ID al final de la URL
    fetch(`http://localhost:3000/api/usuarios/${id}`, {
      method: 'DELETE' // Especificamos el método HTTP
    })
    .then(res => res.json())
    .then(datos => {
      if (datos.exito) {
        cargarUsuarios(); // Recargamos la lista para ver los cambios
      }
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Lista de usuarios</h1>
      
      <form onSubmit={agregarUsuario} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Nombre del usuario..." 
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          required
        />
        <button type="submit">Añadir usuario</button>
      </form>

      <ul>
        {usuarios.map(usuario => (
          <li key={usuario.id} style={{ marginBottom: '10px' }}>
            <strong>{usuario.nombre}</strong> - {usuario.rol}
            
            <button 
              onClick={() => eliminarUsuario(usuario.id)} 
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;