# Arquitectura de la Aplicación: Gestión de Empanadas Chilenas

## 1. Visión General del Proyecto

El objetivo de este proyecto es desarrollar una aplicación full-stack para la gestión de un catálogo de empanadas chilenas, como parte de la prueba técnica para el rol de Desarrollador Fullstack Frontend.

La arquitectura está diseñada para ser desacoplada, separando claramente las responsabilidades entre el backend (lógica de negocio y datos) y el frontend (interfaz de usuario), comunicándose a través de una API REST.

**Stack Tecnológico:**

- **Backend:** Node.js con Express.js
- **Frontend:** PHP con CodeIgniter 4 y JavaScript (Vanilla JS/AJAX)
- **Base de Datos:** MySQL
- **Contenerización:** Docker y Docker Compose
- **Control de Versiones:** Git

---

## 2. Arquitectura del Backend (Node.js API REST)

El backend es una API RESTful construida con Node.js y el framework Express.js. Su única responsabilidad es gestionar la lógica de negocio y la persistencia de los datos de las empanadas.

### 2.1. Decisiones Clave

- **Framework - Express.js:** Se eligió Express.js por su minimalismo, flexibilidad y amplio soporte de la comunidad. Es ideal para construir APIs REST de manera rápida y eficiente sin imponer una estructura rígida, lo cual es perfecto para este desafío.
- **Conector de Base de Datos - `mysql2`:** Se optó por la librería `mysql2` sobre la `mysql` tradicional debido a su mejor rendimiento y, crucialmente, su soporte para Promesas (`async/await`). Esto permite escribir un código asíncrono mucho más limpio y legible, evitando el "callback hell".
- **Gestión de Entorno - `dotenv`:** Para manejar variables de entorno y mantener las credenciales de la base de datos y otras configuraciones sensibles fuera del control de versiones. Esto es una práctica de seguridad estándar.
- **CORS:** Se habilitó a través del middleware `cors` para permitir que el frontend, servido desde un dominio/puerto diferente, pueda consumir la API sin ser bloqueado por las políticas de seguridad del navegador (Same-Origin Policy).
- **Estructura del Código:**
  - `index.js`: Punto de entrada principal. Configura el servidor, los middlewares y define las rutas.
  - `db.js`: Módulo dedicado exclusivamente a la configuración y exportación de la conexión a la base de datos (utilizando un pool de conexiones para mayor eficiencia).

### 2.2. Endpoints de la API

| Verbo    | Ruta                | Descripción                             |
| -------- | ------------------- | --------------------------------------- |
| `GET`    | `/api/empanadas`    | Obtiene la lista completa de empanadas. |
| `POST`   | `/api/empanada`     | Crea una nueva empanada.                |
| `PUT`    | `/api/empanada/:id` | Actualiza una empanada existente.       |
| `DELETE` | `/api/empanada/:id` | Elimina una empanada por su ID.         |

---

## 3. Arquitectura del Frontend (CodeIgniter + JavaScript)

_(Esta sección la llenaremos cuando lleguemos a la parte del frontend)._

---

## 4. Orquestación y Despliegue (Docker)

_(Esta sección la llenaremos cuando configuremos Docker)._

---

## 5. Control de Versiones (Git)

Se utiliza un flujo de trabajo basado en ramas para separar el desarrollo de nuevas características del código estable.

- **`main`:** Rama principal que contiene la versión estable y funcional del código.
- **`feature/*`:** Ramas de características (ej. `feature/backend-api`, `feature/frontend-ui`). Todo el desarrollo nuevo se realiza en estas ramas y luego se fusiona en `main` a través de Pull Requests (o merge directo para este proyecto).

Los commits se realizan de forma atómica y siguen la convención de Commits Convencionales (ej. `feat:`, `fix:`, `docs:`) para mantener un historial claro y legible.
