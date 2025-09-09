// 1. IMPORTACIONES
import express from "express"; // El esqueleto del servidor
import cors from "cors"; // El portero que permite las conexiones
import { pool } from "./db.js"; // Nuestra conexión a la base de datos

// 2. INICIALIZACIÓN
const app = express();
const PORT = process.env.PORT || 3000;

// 3. MIDDLEWARE: Son "ayudantes" que procesan la petición antes de que llegue a nuestras rutas.
app.use(cors()); // Usamos el portero para permitir peticiones desde el frontend
app.use(express.json()); // Este ayudante permite que nuestro servidor entienda JSON que nos envíe el frontend.

// 4. RUTAS (ENDPOINTS): Las direcciones de nuestra API

// --- OBTENER TODAS LAS EMPANADAS (GET /api/empanadas) ---
app.get("/api/empanadas", async (req, res) => {
  try {
    // Le pedimos al pool de conexiones que ejecute una consulta SQL.
    // La consulta 'SELECT * FROM empanadas' significa "selecciona todas las columnas de la tabla empanadas".
    const [rows] = await pool.query(
      "SELECT * FROM empanadas ORDER BY created_at DESC"
    );
    // Enviamos las filas (rows) obtenidas como respuesta en formato JSON.
    res.json(rows);
  } catch (error) {
    // Si algo sale mal (ej: la tabla no existe), capturamos el error.
    console.error(error);
    // Enviamos una respuesta de error al cliente.
    res.status(500).json({ message: "Error al obtener las empanadas" });
  }
});

// --- CREAR UNA NUEVA EMPANADA (POST /api/empanada) ---
app.post("/api/empanada", async (req, res) => {
  try {
    // Sacamos los datos de la nueva empanada del "cuerpo" (body) de la petición.
    const { name, type, filling, price } = req.body;

    // Una pequeña validación para asegurar que los datos importantes vienen.
    if (!name || !type) {
      return res
        .status(400)
        .json({ message: "El nombre y el tipo son obligatorios" });
    }

    // Ejecutamos la consulta SQL para insertar los datos.
    // Usamos '?' para prevenir ataques de inyección SQL. Los valores se pasan en un array.
    const [result] = await pool.query(
      "INSERT INTO empanadas (name, type, filling, price) VALUES (?, ?, ?, ?)",
      [name, type, filling, price]
    );

    // Respondemos al cliente con un código 201 (Creado) y le devolvemos
    // los datos de la empanada creada, incluyendo el nuevo ID.
    res.status(201).json({
      id: result.insertId,
      name,
      type,
      filling,
      price,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la empanada" });
  }
});

// --- ACTUALIZAR UNA EMPANADA (PUT /api/empanada/:id) ---
app.put("/api/empanada/:id", async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el ID de la URL
    const { name, type, filling, price, is_sold_out } = req.body; // Obtenemos los nuevos datos

    const [result] = await pool.query(
      "UPDATE empanadas SET name = ?, type = ?, filling = ?, price = ?, is_sold_out = ? WHERE id = ?",
      [name, type, filling, price, is_sold_out, id]
    );

    // Si la consulta no afectó a ninguna fila, significa que la empanada no existía.
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Empanada no encontrada" });
    }

    res.json({ message: "Empanada actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la empanada" });
  }
});

// --- ELIMINAR UNA EMPANADA (DELETE /api/empanada/:id) ---
app.delete("/api/empanada/:id", async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el ID de la URL

    const [result] = await pool.query("DELETE FROM empanadas WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Empanada no encontrada" });
    }

    // Respondemos con un código 204 (Sin Contenido), que es lo estándar para un DELETE exitoso.
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la empanada" });
  }
});

// 5. ARRANQUE DEL SERVIDOR: Ponemos nuestra API a escuchar peticiones en el puerto especificado.
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
