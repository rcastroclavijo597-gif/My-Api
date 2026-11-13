import express from "express";

const app = express();
app.use(express.json());

let productos = [
  { id: 1, nombre: "Teclado", precio: 80000, stock: 10 },
  { id: 2, nombre: "Mouse", precio: 35000, stock: 25 },
];

let siguienteId = 3;


// GET - Listar todos los productos
// Reto: filtrar por precio máximo con query params -> GET /productos?max=50000
app.get("/productos", (req, res) => {
  const { max } = req.query;

  if (max === undefined) {
    return res.status(200).json(productos);
  }

  const precioMaximo = Number(max);

  if (!Number.isFinite(precioMaximo) || precioMaximo < 0) {
    return res.status(400).json({
      error: "El parámetro max debe ser un número mayor o igual a 0"
    });
  }

  const filtrados = productos.filter(p => p.precio <= precioMaximo);

  res.status(200).json(filtrados);
});


// GET - Buscar un producto por ID
app.get("/productos/:id", (req, res) => {
  const id = Number(req.params.id);

  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  res.status(200).json(producto);
});


// POST - Crear un nuevo producto
app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  if (
    typeof nombre !== "string" ||
    nombre.trim() === "" ||
    typeof precio !== "number" ||
    !Number.isFinite(precio) ||
    precio < 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    return res.status(400).json({
      error: "Los datos del producto no son válidos"
    });
  }

  const nuevoProducto = {
    id: siguienteId++,
    nombre: nombre.trim(),
    precio,
    stock
  };

  productos.push(nuevoProducto);

  res.status(201).json(nuevoProducto);
});


// PUT - Reemplazar todos los datos de un producto
app.put("/productos/:id", (req, res) => {
  const id = Number(req.params.id);

  const posicion = productos.findIndex(p => p.id === id);

  if (posicion === -1) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  const { nombre, precio, stock } = req.body;

  if (
    typeof nombre !== "string" ||
    nombre.trim() === "" ||
    typeof precio !== "number" ||
    !Number.isFinite(precio) ||
    precio < 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    return res.status(400).json({
      error: "Los datos del producto no son válidos"
    });
  }

  productos[posicion] = {
    id,
    nombre: nombre.trim(),
    precio,
    stock
  };

  res.status(200).json(productos[posicion]);
});


// PATCH - Actualizar algunos datos de un producto
app.patch("/productos/:id", (req, res) => {
  const id = Number(req.params.id);

  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  const { nombre, precio, stock } = req.body;

  if (
    (nombre === undefined &&
      precio === undefined &&
      stock === undefined) ||
    (nombre !== undefined &&
      (typeof nombre !== "string" || nombre.trim() === "")) ||
    (precio !== undefined &&
      (typeof precio !== "number" ||
        !Number.isFinite(precio) || precio < 0)) ||
    (stock !== undefined &&
      (!Number.isInteger(stock) || stock < 0))
  ) {
    return res.status(400).json({
      error: "Los datos para actualizar no son válidos"
    });
  }

  if (nombre !== undefined) {
    producto.nombre = nombre.trim();
  }

  if (precio !== undefined) {
    producto.precio = precio;
  }

  if (stock !== undefined) {
    producto.stock = stock;
  }

  res.status(200).json(producto);
});


// DELETE - Eliminar un producto por ID
app.delete("/productos/:id", (req, res) => {
  const id = Number(req.params.id);

  const posicion = productos.findIndex(p => p.id === id);

  if (posicion === -1) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  productos.splice(posicion, 1);

  res.status(204).send();
});


// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor listo en http://localhost:3000");
});