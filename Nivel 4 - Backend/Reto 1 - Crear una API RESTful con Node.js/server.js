const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'API de usuarios',
		version: '1.0.0',
		description: 'API REST para gestionar usuarios en memoria.'
	},
	servers: [
		{
			url: 'http://localhost:3000',
			description: 'Servidor local'
		}
	],
	tags: [
		{
			name: 'Usuarios',
			description: 'Operaciones CRUD de usuarios'
		}
	],
	components: {
		schemas: {
			Usuario: {
				type: 'object',
				properties: {
					id: { type: 'integer', example: 1 },
					nombre: { type: 'string', example: 'Carlos García' },
					email: { type: 'string', format: 'email', example: 'carlos@example.com' }
				},
				required: ['id', 'nombre', 'email']
			},
			NuevoUsuario: {
				type: 'object',
				properties: {
					nombre: { type: 'string', example: 'Carlos García' },
					email: { type: 'string', format: 'email', example: 'carlos@example.com' }
				},
				required: ['nombre', 'email']
			},
			Error: {
				type: 'object',
				properties: {
					error: { type: 'string', example: 'Usuario no encontrado.' }
				},
				required: ['error']
			}
		}
	}
};

const swaggerSpec = swaggerJsdoc({
	swaggerDefinition,
	apis: ['./server.js']
});

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let siguienteId = 1;
const usuarios = [];

app.get('/', (req, res) => {
	res.json({
		mensaje: 'API de usuarios funcionando.',
		rutas: ['/usuarios']
	});
});

function datosDeUsuarioValidos(body) {
	return body && typeof body.nombre === 'string' && typeof body.email === 'string';
}

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoUsuario'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos obligatorios ausentes o inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/usuarios', (req, res) => {
	if (!datosDeUsuarioValidos(req.body)) {
		return res.status(400).json({
			error: 'Los campos nombre y email son obligatorios y deben ser texto.'
		});
	}

	const usuario = {
		id: siguienteId++,
		nombre: req.body.nombre,
		email: req.body.email
	};

	usuarios.push(usuario);
	return res.status(201).json(usuario);
});

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
app.get('/usuarios', (req, res) => {
	res.json(usuarios);
});

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador numérico del usuario
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/usuarios/:id', (req, res) => {
	const usuario = usuarios.find((item) => item.id === Number(req.params.id));

	if (!usuario) {
		return res.status(404).json({ error: 'Usuario no encontrado.' });
	}

	return res.json(usuario);
});

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador numérico del usuario
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevoUsuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos obligatorios ausentes o inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.put('/usuarios/:id', (req, res) => {
	const indice = usuarios.findIndex((item) => item.id === Number(req.params.id));

	if (indice === -1) {
		return res.status(404).json({ error: 'Usuario no encontrado.' });
	}

	if (!datosDeUsuarioValidos(req.body)) {
		return res.status(400).json({
			error: 'Los campos nombre y email son obligatorios y deben ser texto.'
		});
	}

	usuarios[indice] = {
		id: usuarios[indice].id,
		nombre: req.body.nombre,
		email: req.body.email
	};

	return res.json(usuarios[indice]);
});

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador numérico del usuario
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/usuarios/:id', (req, res) => {
	const indice = usuarios.findIndex((item) => item.id === Number(req.params.id));

	if (indice === -1) {
		return res.status(404).json({ error: 'Usuario no encontrado.' });
	}

	usuarios.splice(indice, 1);
	return res.status(204).send();
});

app.listen(PORT, () => {
	console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
