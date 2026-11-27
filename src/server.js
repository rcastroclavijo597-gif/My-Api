import express from "express";
import { authRouter } from "./routes/auth.routes.js";
import { productosRouter } from "./routes/productos.routes.js";
import { categoriasRouter } from "./routes/categorias.routes.js";

// server.js solo conecta las piezas: la lógica está en routes/
const app = express();
app.set("json spaces", 2);
app.use(express.json());

app.use(authRouter);                       // /registro y /login
app.use("/productos", productosRouter);
app.use("/categorias", categoriasRouter);

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor listo en http://localhost:3000");
});
