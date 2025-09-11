// backend/__tests__/empanadas.test.js

import request from "supertest";
import { app, server } from "../index.js";
import { pool } from "../db.js";

const API_KEY = "mi-clave-ultra-secreta-12345";

beforeAll((done) => {
  done();
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
  await pool.end();
});

describe("API de Empanadas - Pruebas de Endpoints", () => {
  test("GET /api/empanadas - Debería devolver un array de empanadas", async () => {
    const response = await request(app)
      .get("/api/empanadas")
      .set("X-API-KEY", API_KEY);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /api/empanada - Debería crear una nueva empanada", async () => {
    const nuevaEmpanada = {
      name: "Napolitana",
      type: "Horno",
      price: 2200,
    };
    const response = await request(app)
      .post("/api/empanada")
      .set("X-API-KEY", API_KEY)
      .send(nuevaEmpanada);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(nuevaEmpanada.name);
    expect(response.body).toHaveProperty("id");
  });

  test("POST /api/empanada - Debería fallar si faltan datos requeridos", async () => {
    const empanadaInvalida = { type: "Frita", price: 1500 };
    const response = await request(app)
      .post("/api/empanada")
      .set("X-API-KEY", API_KEY)
      .send(empanadaInvalida);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("El nombre y el tipo son obligatorios");
  });

  test("GET /api/empanadas - Debería fallar si el API Key es incorrecto", async () => {
    const response = await request(app)
      .get("/api/empanadas")
      .set("X-API-KEY", "esta-clave-es-incorrecta");

    expect(response.statusCode).toBe(401);
  });
});
