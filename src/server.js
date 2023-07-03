const express = require("express");
const { findOneById, findAll, create, update, destroy } = require("./database/libros.manager.js");

require('dotenv').config();

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Obtener todos los libros: Ruta GET http://127.0.0.1:3000/libros
server.get('/libros', (req, res) => {
    findAll()
        .then((libros) => res.status(200).send(libros))
        .catch((error) => res.status(400).send(error.message));
});

// Obtener un libro en específico: Ruta GET http://127.0.0.1:3000/libros/1
server.get('/libros/:id', (req, res) => {
    const { id } = req.params;

    findOneById(Number(id))
        .then((libro) => res.status(200).send(libro))
        .catch((error) => res.status(400).send(error.message));
});

// Crear un nuevo libro: Ruta POST http://127.0.0.1:3000/libros
server.post('/libros', (req, res) => {
    const { titulo, autor, edicion, idioma, editorial, precio } = req.body;
    let msj = `El libro se ha creado exitosamente`;

    create({ titulo, autor, edicion, idioma, editorial, precio: Number(precio) })
        .then((libro) => res.status(201).send({ libroCreado: libro, mensaje: msj }))
        .catch((error) => res.status(400).send(error.message));
});

// Actualizar un libro en específico: Ruta PUT http://127.0.0.1:3000/libros/1
server.put('/libros/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, autor, edicion, idioma, editorial, precio } = req.body;
    let msj = `El libro cuyo ID es: ${id} ha sido actualizado exitosamente`;

    update({ id: Number(id), titulo, autor, edicion, idioma, editorial, precio: Number(precio) })
        .then((libro) => res.status(200).send({ libroActualizado: libro, mensaje: msj }))
        .catch((error) => res.status(400).send(error.message));
});

// Eliminar un libro en particular: Ruta DELETE http://127.0.0.1:3000/libros/1
server.delete('/libros/:id', (req, res) => {
    const { id } = req.params;
    let msj = `Este libro cuyo ID era: ${id} ha sido eliminado`;
    destroy(Number(id))
        .then((libro) => res.status(200).send({ libroEliminado: libro, mensaje: msj }))
        .catch((error) => res.status(400).send(error.message));
});

// Control de rutas inexistentes
server.use('*', (req, res) => {
    let html = `<body style="background-color: rgb(197, 197, 197)"><h1 style="text-align: center; margin-top: 10px; font-size: 38px; font-family: Arial, Helvetica, sans-serif; color: red">Error 404</h1><br><h3 style="font-size: 20px">La URL indicada es inexistente <span style="background-color: rgba(255, 255, 0, 0.646); color: red; font-weight: bold">(Not Found)</span></h3></body>`;
    res.status(404).send(html);
});

// Método oyente de peticiones
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/libros`);
});