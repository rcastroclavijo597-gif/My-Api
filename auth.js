import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db.js";

export const authRouter = Router();

// POST /registro - crea un usuario con la clave en hash
authRouter.post("/registro", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y password son obligatorios" });
    }
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO usuarios (email, password) VALUES (?, ?)", [email, hash]
    );
    res.status(201).json({ mensaje: "Usuario creado" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Ese email ya existe" });
    }
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// POST /login - entrega el token
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [filas] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?", [email]
    );
    const usuario = filas[0];
    if (!usuario) {
      return res.status(401).json({ error: "Email o clave incorrectos" });
    }

    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) {
      return res.status(401).json({ error: "Email o clave incorrectos" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// Middleware: deja pasar solo si hay token válido
