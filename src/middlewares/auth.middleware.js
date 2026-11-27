import jwt from "jsonwebtoken";

// 401: no hay token, o es inválido o está vencido
export function verificarToken(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [tipo, token] = header.split(" ");
  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ error: "Falta el token" });
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o vencido" });
  }
}

// 403: hay token, pero el usuario no es admin
export function soloAdmin(req, res, next) {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ error: "Solo un admin puede hacer esto" });
  }
  next();
}
