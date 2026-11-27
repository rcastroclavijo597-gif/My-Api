import { Router } from "express";
import { db } from "../db.js";
import { categoriaValida } from "../validaciones.js";
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware.js";

// Se monta en server.js con app.use("/categorias", categoriasRouter)
export const categoriasRouter = Router();

// GET /categorias
categoriasRouter.get("/", async (req, res) => {
  try {
    const [filas] = await db.query("SELECT * FROM categorias");
    res.status(200).json(filas);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// GET /categorias/:id
categoriasRouter.get("/:id", async (req, res) => {
  try {
    const [filas] = await db.query(
      "SELECT * FROM categorias WHERE id = ?", [req.params.id]
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

// POST /categorias - crear una categoría
categoriasRouter.post("/", verificarToken, async (req, res) => {
  try {
    const { nombre } = req.body ?? {};
    if (!categoriaValida({ nombre })) {
      return res.status(400).json({ error: "El nombre de la categoría es obligatorio" });
    }
    const [resultado] = await db.query(
      "INSERT INTO categorias (nombre) VALUES (?)", [nombre.trim()]
    );
    res.status(201).json({ id: resultado.insertId, nombre: nombre.trim() });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Esa categoría ya existe" });
    }
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// PUT /categorias/:id - cambiar el nombre
categoriasRouter.put("/:id", verificarToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre } = req.body ?? {};
    if (!categoriaValida({ nombre })) {
      return res.status(400).json({ error: "El nombre de la categoría es obligatorio" });
    }
    const [resultado] = await db.query(
      "UPDATE categorias SET nombre = ? WHERE id = ?", [nombre.trim(), id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.status(200).json({ id, nombre: nombre.trim() });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Esa categoría ya existe" });
    }
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// DELETE /categorias/:id - solo admin
categoriasRouter.delete("/:id", verificarToken, soloAdmin, async (req, res) => {
  try {
    const [resultado] = await db.query(
      "DELETE FROM categorias WHERE id = ?", [Number(req.params.id)]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});
