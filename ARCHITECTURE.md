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

### 2.3. Pruebas

La calidad y fiabilidad del backend se aseguran mediante una suite de pruebas de integración automatizadas.

- **Framework de Pruebas - Jest:** Se eligió Jest por su simplicidad, su potente sistema de aserciones (`expect`) y su ecosistema integrado (runner, mocks, etc.).
- **Peticiones HTTP - Supertest:** Se utiliza la librería `Supertest` para realizar peticiones HTTP a los endpoints de la API directamente desde el entorno de pruebas, permitiendo verificar tanto los códigos de estado como el contenido de las respuestas.
- **Entorno de Pruebas:** Se configuró un entorno de pruebas aislado utilizando un archivo `.env.test` y la librería `cross-env`. Esto permite que las pruebas se ejecuten contra la base de datos dockerizada (a través de `localhost`) sin interferir con la configuración de desarrollo principal.
- **Cobertura:** Se implementaron 3 pruebas clave que cubren el "camino feliz" y los casos de error para los endpoints CRUD, asegurando la funcionalidad principal de la API.

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

- **Experiencia de Usuario (UX):** La experiencia de usuario se enriqueció con patrones modernos como modales para la edición, carga optimista con skeletons, notificaciones (toasts) y un sistema de búsqueda y filtrado en tiempo real con debounce para optimizar el rendimiento.
  Se implementaron validaciones de formulario del lado del cliente utilizando atributos HTML5 para garantizar la integridad básica de los datos antes del envío. Adicionalmente, se mejoró el feedback al usuario deshabilitando el botón de envío y mostrando un estado de "Guardando..." durante las peticiones asíncronas, evitando envíos duplicados.

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

## 6. Seguridad

Se ha implementado una capa de seguridad básica pero efectiva para proteger los endpoints de la API.

- **Autenticación por API Key:** Todas las rutas bajo `/api/` están protegidas por un middleware que verifica la presencia y validez de un encabezado `X-API-KEY` en cada petición.
- **Almacenamiento de Secretos:** La clave secreta de la API se almacena de forma segura como una variable de entorno utilizando la librería `dotenv`, evitando que quede expuesta en el código fuente.
- **Respuesta ante Fallos:** Si la API Key es inválida o no se proporciona, la API responde con un código de estado `401 Unauthorized` y deniega el acceso, impidiendo que la petición llegue a la lógica de negocio.

## 7. Desafíos Técnicos y Soluciones Implementadas

Durante el desarrollo de este proyecto, surgieron varios desafíos técnicos que requirieron investigación y la aplicación de soluciones específicas. Documentarlos es clave para entender la robustez de la arquitectura final.

### 1. Condición de Carrera en el Arranque de Contenedores Docker

- **El Problema:** Al iniciar los servicios con `docker-compose up`, el contenedor de la API (`api`) arrancaba más rápido que el contenedor de la base de datos (`db`). Esto provocaba que la API intentara establecer una conexión antes de que MySQL estuviera listo para aceptarlas, resultando en un error `ECONNREFUSED` y la caída del servicio de Node.js.
- **La Solución:** La directiva `depends_on` en Docker Compose no fue suficiente, ya que solo garantiza el orden de inicio de los contenedores, no la disponibilidad del servicio _dentro_ de ellos. La solución robusta fue implementar un `healthcheck` en el servicio `db`. Este chequeo utiliza el comando `mysqladmin ping` para verificar activamente que el servidor MySQL esté respondiendo. Complementariamente, se modificó la dependencia del servicio `api` a `condition: service_healthy`, forzando a la API a esperar hasta que la base de datos no solo estuviera iniciada, sino completamente operativa.

### 2. Incompatibilidad de Módulos (ESM vs. CommonJS) en el Entorno de Pruebas

- **El Problema:** El código fuente del backend fue escrito utilizando la sintaxis moderna de ES Modules (`import`/`export`), especificado con `"type": "module"` en `package.json`. Sin embargo, Jest, por defecto, opera en un entorno de CommonJS (`require`/`module.exports`), lo que generaba un `SyntaxError: Cannot use import statement outside a module` al intentar ejecutar las pruebas.
- **La Solución:** Se resolvió instruyendo a Node.js para que ejecutara Jest utilizando su soporte experimental para módulos de VM. El script `test` en `package.json` fue modificado a: `"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"`. Esto permitió que el entorno de pruebas interpretara correctamente la sintaxis de ES Modules sin necesidad de transpiladores como Babel, manteniendo la configuración del proyecto limpia y consistente.

### 3. Fugas de Recursos ("Open Handles") al Finalizar las Pruebas

- **El Problema:** Después de que las pruebas se ejecutaban exitosamente, Jest advertía sobre "open handles" y no finalizaba el proceso limpiamente. Esto se debía a que las conexiones a la base de datos (el `pool` de `mysql2`) y el propio servidor de Express (`app.listen`) permanecían activos en memoria.
- **La Solución:** Se implementaron los hooks `afterAll` de Jest para gestionar el ciclo de vida de los recursos. Utilizando `async/await`, se programó el cierre explícito y ordenado de los servicios: primero se cierra el servidor de Express (`server.close()`) y luego se cierra el pool de conexiones de la base de datos (`pool.end()`). Esto aseguró una finalización limpia del proceso de pruebas, liberando todos los recursos correctamente.
