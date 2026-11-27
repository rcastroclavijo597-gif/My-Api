// Reglas para revisar los datos que llegan en el body.
// Devuelven true si los datos sirven y false si no.

const textoValido = (v) => typeof v === "string" && v.trim() !== "";
const precioValido = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;
const stockValido = (v) => Number.isInteger(v) && v >= 0;

// POST y PUT: vienen todos los campos
export function productoValido({ nombre, precio, stock }) {
  return textoValido(nombre) && precioValido(precio) && stockValido(stock);
}

// PATCH: viene al menos un campo, y los que vienen son válidos
export function cambiosProductoValidos({ nombre, precio, stock }) {
  if (nombre === undefined && precio === undefined && stock === undefined) return false;
  if (nombre !== undefined && !textoValido(nombre)) return false;
  if (precio !== undefined && !precioValido(precio)) return false;
  if (stock !== undefined && !stockValido(stock)) return false;
  return true;
}

// Categorías: solo necesitan un nombre
export function categoriaValida({ nombre }) {
  return textoValido(nombre);
}

// Registro y login: email y password obligatorios
export function credencialesValidas({ email, password }) {
  return textoValido(email) && textoValido(password);
}
