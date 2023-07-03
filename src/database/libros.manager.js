const fs   = require("fs");
const path = require("path");

const ruta = path.join(__dirname, "libros.json");

function escribir(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(ruta, JSON.stringify(contenido, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se puede escribir"));

            resolve(true);
        });
    });
}

function leer() {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, "utf8", (error, result) => {
            if (error) reject(new Error("Error. No se puede leer"));

            resolve(JSON.parse(result));
        });
    });
}

function generarId(libros) {

    let idMayor = 0;

    libros.forEach((libro) => {
        let idLibro = Number(libro.id);
        if (idLibro > idMayor) {
            idMayor = idLibro;
        }
    });

    return ++idMayor;
}

async function findOneById(id) {
    if (!id) throw new Error("Error. El ID no está definido.");

    const libros = await leer();
    const libro  = libros.find((elemento) => elemento.id === id);

    if (!libro) throw new Error("Error. No existe un libro con tal ID.");

    return libro;
}

async function findAll() {
    const libros = await leer();
    return libros;
}

async function create(libro) {
    if (!libro?.titulo || !libro?.autor || !libro?.edicion || !libro?.idioma || !libro?.editorial || !libro?.precio) throw new Error("Error. Datos incompletos.");

    let libros = await leer();
    const nuevoLibro = { id: generarId(libros), ...libro };

    libros.push(nuevoLibro);
    await escribir(libros);

    return nuevoLibro;
}

async function update(libro) {
    if (!libro?.id || !libro?.titulo || !libro?.autor || !libro?.edicion || !libro?.idioma || !libro?.editorial || !libro?.precio) throw new Error("Error. Datos incompletos.");

    let libros   = await leer();
    const indice = libros.findIndex((element) => element.id === libro.id);

    if (indice < 0) throw new Error("Error. El ID no se corresponde con ningún libro existente.");

    libros[indice] = libro;
    await escribir(libros);

    return libros[indice];
}

async function destroy(id) {
    if (!id) throw new Error("Error. El ID no está definido.");

    let libros = await leer();
    const indice = libros.findIndex((element) => element.id === id);

    if (indice < 0) throw new Error("Error. El ID no se corresponde con ningún libro existente.");

    const libroElimin = libros[indice];
    libros.splice(indice, 1);
    await escribir(libros);

    return libroElimin;
}

module.exports = { findOneById, findAll, create, update, destroy };