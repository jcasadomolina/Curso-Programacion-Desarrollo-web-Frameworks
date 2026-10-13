const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Permite a Express leer JSON en el body

let usuarios = [
  { id: 1, nombre: "Ana", rol: "Admin" },
  { id: 2, nombre: "Carlos", rol: "User" }
];

// GET: Leer usuarios
app.get('/api/usuarios', (req, res) => {
  res.json({ exito: true, usuarios: usuarios });
});

// POST: Crear nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre: req.body.nombre,
    rol: req.body.rol || "User"
  };
  usuarios.push(nuevoUsuario);
  
  res.json({ exito: true, usuario: nuevoUsuario });
});

// DELETE: Borrar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const idABorrar = parseInt(req.params.id); 
  usuarios = usuarios.filter(usuario => usuario.id !== idABorrar); 
  res.json({ exito: true, mensaje: "Usuario eliminado correctamente" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});