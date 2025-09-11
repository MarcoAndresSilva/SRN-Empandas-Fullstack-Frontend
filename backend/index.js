// IMPORTACIONES
import express from "express";
import cors from "cors";
import { pool } from "./db.js";

// INICIALIZACIÓN
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE:
app.use(cors());
app.use(express.json());

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey && apiKey === process.env.API_KEY_SECRET) {
    next();
  } else {
    res.status(401).json({
      message: "Acceso no autorizado: API Key inválida o no proporcionada.",
    });
  }
};

app.use("/api", apiKeyMiddleware);

// RUTAS (ENDPOINTS)
// --- OBTENER TODAS LAS EMPANADAS (GET /api/empanadas)
app.get("/api/empanadas", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM empanadas ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las empanadas" });
  }
});

// CREAR EMPANADA (POST /api/empanada)
app.post("/api/empanada", async (req, res) => {
  try {
    const { name, type, filling, price } = req.body;

    if (!name || !type) {
      return res
        .status(400)
        .json({ message: "El nombre y el tipo son obligatorios" });
    }
    const [result] = await pool.query(
      "INSERT INTO empanadas (name, type, filling, price) VALUES (?, ?, ?, ?)",
      [name, type, filling, price]
    );

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

// ACTUALIZAR EMPANADA (PUT /api/empanada/:id)
app.put("/api/empanada/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, filling, price, is_sold_out } = req.body;

    const [result] = await pool.query(
      "UPDATE empanadas SET name = ?, type = ?, filling = ?, price = ?, is_sold_out = ? WHERE id = ?",
      [name, type, filling, price, is_sold_out, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Empanada no encontrada" });
    }

    res.json({ message: "Empanada actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la empanada" });
  }
});

// ELIMINAR EMPANADA (DELETE /api/empanada/:id)
app.delete("/api/empanada/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM empanadas WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Empanada no encontrada" });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la empanada" });
  }
});

//  ARRANQUE DEL SERVIDOR
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export { app, server };
