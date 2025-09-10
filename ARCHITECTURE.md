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

El frontend es un proyecto monolítico servido por CodeIgniter 4, cuya única responsabilidad es renderizar la interfaz de usuario (UI) y consumir la API REST del backend.

### 3.1. Decisiones Clave

- **Framework PHP - CodeIgniter 4:** Se utilizó según los requisitos de la prueba. Su rol en este proyecto se ha minimizado intencionadamente a ser un simple servidor de archivos estáticos y una vista inicial. No se utiliza su ORM (Modelo) ni lógica de negocio compleja, ya que toda esa responsabilidad recae en el backend de Node.js. El controlador `Home.php` se modificó mínimamente para servir la vista principal `empanadas_view.php`.

- **Lógica de Cliente - JavaScript Puro (Vanilla JS) con `fetch`:** Toda la interactividad y comunicación con la API se maneja en el lado del cliente a través de un único archivo JavaScript (`public/js/app.js`). Se eligió la API `fetch` por ser el estándar moderno para realizar peticiones HTTP asíncronas (AJAX), ofreciendo una sintaxis limpia y basada en promesas (`async/await`).

- **Estructura:**
  - `app/Controllers/Home.php`: Controlador que renderiza la vista.
  - `app/Views/empanadas_view.php`: Archivo PHP que contiene el esqueleto HTML de la aplicación.
  - `public/js/app.js`: Contiene toda la lógica para listar, crear, editar y eliminar empanadas interactuando con la API REST.

Este enfoque desacoplado permite que el frontend sea un "cliente tonto" que solo se preocupa de la presentación, siguiendo las mejores prácticas de arquitecturas cliente-servidor.

## 4. Orquestación y Despliegue (Docker)

La aplicación está completamente dockerizada para garantizar un entorno de desarrollo consistente, portable y fácil de ejecutar. Se utiliza `Docker Compose` para orquestar los servicios de la aplicación.

### 4.1. Servicios Definidos

- **`db` (Base de Datos):**

  - **Imagen:** `mysql:8.0`.
  - **Responsabilidad:** Provee una instancia aislada de la base de datos MySQL.
  - **Persistencia:** Utiliza un volumen de Docker (`mysql_data`) para que los datos persistan incluso si el contenedor se reinicia o se elimina.
  - **`healthcheck`:** Se ha implementado un `healthcheck` que utiliza `mysqladmin ping`. Esto es crucial para asegurar que el servicio de la API no intente conectarse a la base de datos hasta que esta esté completamente inicializada y lista para aceptar conexiones, resolviendo así posibles condiciones de carrera durante el arranque.

- **`api` (Backend Node.js):**
  - **Construcción:** Se construye a partir de un `Dockerfile` ubicado en la carpeta `backend`.
  - **Imagen Base:** `node:18-alpine` para un tamaño de imagen reducido y mayor seguridad.
  - **Red:** Docker Compose crea una red interna que permite que la API se comunique con el servicio `db` utilizando su nombre de servicio (`http://db:3306`) como host, en lugar de `localhost`.
  - **Dependencia:** El servicio `api` depende explícitamente del estado "saludable" (`service_healthy`) del servicio `db`, gracias al `healthcheck`.

### 4.2. Flujo de Ejecución

Con Docker Desktop corriendo, un desarrollador puede levantar toda la infraestructura de backend con un único comando: `docker-compose up --build`. Esto demuestra la facilidad de configuración y reduce drásticamente el tiempo de onboarding para nuevos miembros del equipo.

## 5. Control de Versiones (Git)

Se utiliza un flujo de trabajo basado en ramas para separar el desarrollo de nuevas características del código estable.

- **`main`:** Rama principal que contiene la versión estable y funcional del código.
- **`feature/*`:** Ramas de características (ej. `feature/backend-api`, `feature/frontend-ui`). Todo el desarrollo nuevo se realiza en estas ramas y luego se fusiona en `main` a través de Pull Requests (o merge directo para este proyecto).

Los commits se realizan de forma atómica y siguen la convención de Commits Convencionales (ej. `feat:`, `fix:`, `docs:`) para mantener un historial claro y legible.
