import { Router } from "express";
import { db } from "../db.js";
import { productoValido, cambiosProductoValidos } from "../validaciones.js";
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware.js";

// Se monta en server.js con app.use("/productos", productosRouter),
// por eso aquí las rutas empiezan en "/" y no en "/productos".
export const productosRouter = Router();

// GET /productos
productosRouter.get("/", async (req, res) => {
  try {
    const [filas] = await db.query("SELECT * FROM productos");
    res.status(200).json(filas);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// GET /productos/:id
productosRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [filas] = await db.query(
      "SELECT * FROM productos WHERE id = ?", [id]
    );

    if (filas.length === 0) {
      return res.status(404).json({ error: "No existe" });
    }

    res.status(200).json(filas[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// POST /productos - crear un producto
productosRouter.post("/", verificarToken, async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body ?? {};

    if (!productoValido({ nombre, precio, stock })) {
      return res.status(400).json({ error: "Los datos del producto no son válidos" });
    }

    const [resultado] = await db.query(
      "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)",
      [nombre.trim(), precio, stock]
    );

    res.status(201).json({ id: resultado.insertId, nombre: nombre.trim(), precio, stock });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// PUT /productos/:id - reemplazar todos los datos
productosRouter.put("/:id", verificarToken, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [filas] = await db.query(
      "SELECT * FROM productos WHERE id = ?", [id]
    );
    if (filas.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const { nombre, precio, stock } = req.body ?? {};
    if (!productoValido({ nombre, precio, stock })) {
      return res.status(400).json({ error: "Los datos del producto no son válidos" });
    }

    await db.query(
      "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?",
      [nombre.trim(), precio, stock, id]
    );

    res.status(200).json({ id, nombre: nombre.trim(), precio, stock });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// PATCH /productos/:id - actualizar algunos datos
productosRouter.patch("/:id", verificarToken, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [filas] = await db.query(
      "SELECT * FROM productos WHERE id = ?", [id]
    );
    if (filas.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const producto = filas[0];
    const { nombre, precio, stock } = req.body ?? {};

    if (!cambiosProductoValidos({ nombre, precio, stock })) {
      return res.status(400).json({ error: "Los datos para actualizar no son válidos" });
    }

    if (nombre !== undefined) producto.nombre = nombre.trim();
    if (precio !== undefined) producto.precio = precio;
    if (stock !== undefined) producto.stock = stock;

    await db.query(
      "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?",
      [producto.nombre, producto.precio, producto.stock, id]
    );

    res.status(200).json(producto);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// DELETE /productos/:id - solo admin
productosRouter.delete("/:id", verificarToken, soloAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [resultado] = await db.query(
      "DELETE FROM productos WHERE id = ?", [id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});
