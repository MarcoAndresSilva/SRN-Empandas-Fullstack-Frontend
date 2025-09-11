# App gestión de empanadas chilenas: “Fonda SRN” 
Una aplicación web full-stack robusta y desacoplada para la gestión de empanadas, desarrollada como solución al desafío técnico para el rol de **Desarrollador Fullstack Frontend**. El proyecto demuestra competencias en la arquitectura de microservicios, orquestación con Docker, desarrollo de API RESTful y consumo de servicios desde un frontend monolítico.

## 📸 Vistas Previas
<p align="center">
  <img src="https://github.com/user-attachments/assets/9622b9d9-8e20-4ef5-8b4f-a875702d3d40"
       alt="Vista General"
       width="700" />
</p>

---

## 🚀 Funcionalidades Clave (Features)

- **Gestión CRUD Completa:** Funcionalidad completa para Crear, Leer, Actualizar y Eliminar empanadas.
- **Arquitectura Desacoplada:** El backend (lógica de negocio) y el frontend (UI) son servicios completamente independientes que se comunican a través de una API REST.
- **Seguridad de API:** Los endpoints del backend están protegidos mediante un sistema de autenticación por **API Key estática**, previniendo el acceso no autorizado.
- **Entorno Contenerizado:** Toda la aplicación (backend + base de datos) está orquestada con **Docker y Docker Compose**, garantizando un entorno de desarrollo consistente y un despliegue simplificado.
- **Pruebas Automatizadas:** El backend cuenta con una suite de **pruebas de integración** (con Jest y Supertest) que validan la funcionalidad de todos los endpoints.
- **Interfaz Reactiva:** La UI, construida con JavaScript puro, interactúa con la API de forma asíncrona (AJAX), ofreciendo una experiencia de usuario fluida sin recargas de página.
- **Experiencia de Usuario Mejorada (UX):** El formulario incluye validaciones del lado del cliente y feedback visual (estados de carga en botones) para mejorar la interacción.

---

## 🏛️ Arquitectura y Decisiones de Diseño

Este proyecto fue concebido siguiendo principios de diseño de software modernos, priorizando la separación de responsabilidades, la escalabilidad y la mantenibilidad. Para un análisis exhaustivo del proceso de desarrollo, las decisiones técnicas, los desafíos encontrados y las soluciones implementadas, por favor consulta el siguiente documento:

### **[📄 Leer el Documento de Arquitectura](./ARCHITECTURE.md)**

---

## 🛠️ Stack Tecnológico y Herramientas

### ⚙️ Backend y Base de Datos

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
</p>

### 🎨 Frontend

<p>
  <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP" />
  <img src="https://img.shields.io/badge/CodeIgniter-EF4223?style=for-the-badge&logo=codeigniter&logoColor=white" alt="CodeIgniter" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
</p>

### 🛠️ Herramientas, DevOps y Pruebas

<p>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
  <img src="https://img.shields.io/badge/Insomnia-4000BF?style=for-the-badge&logo=insomnia&logoColor=white" alt="Insomnia" />
  <img src="https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white" alt="VS Code" />
</p>

---


## ☁️ Demo en Vivo y Despliegue

La arquitectura desacoplada de este proyecto permite el despliegue independiente de sus componentes. Actualmente, el backend está completamente desplegado y operativo en la nube.

### **Backend API (Desplegado en Railway)**

La API REST, construida con Node.js y Docker, está alojada en Railway y conectada a una base de datos MySQL. Es completamente funcional y puede ser probada con cualquier cliente de API como Insomnia o Postman.

-   **URL Base de la API:** `https://srn-empanadas-ffronend-production-faf5.up.railway.app`
-   **Endpoint de Ejemplo (GET):** `https://srn-empanadas-ffronend-production-faf5.up.railway.app/api/empanadas`
-   **API Key Requerida:** Todas las peticiones deben incluir el siguiente encabezado HTTP:
    -   `X-API-KEY`: `mi-clave-ultra-secreta-12345`

### **Frontend (Ejecución Local)**

Debido a desafíos de compatibilidad con los runtimes de PHP en las principales plataformas serverless, el frontend de CodeIgniter está configurado para una ejecución local óptima, conectándose directamente a la API en producción. Las instrucciones completas se encuentran en la sección "Instalación y Ejecución Local".

## ⚙️ Instalación y Ejecución Local

Para clonar y ejecutar este proyecto en tu máquina local, sigue estos pasos.

### Prerrequisitos

- [Docker](https://www.docker.com/products/docker-desktop/) y [Docker Compose](https://docs.docker.com/compose/install/) (Docker Desktop usualmente incluye ambos).
- [PHP](https://www.php.net/manual/es/install.php) y [Composer](https://getcomposer.org/download/) instalados en el sistema local o en WSL.

### 1. Clonar el Repositorio

```bash
git clone https://github.com/MarcoAndresSilva/srn-empanadas-ffronend.git
cd srn-empanadas-ffronend
```

### 2. Iniciar el Backend y la Base de Datos (Docker)

Este comando levantará los contenedores de la API y la base de datos MySQL. La primera vez puede tardar unos minutos mientras se descargan las imágenes.

```bash
docker-compose up --build
```

La API estará disponible en http://localhost:3000.
La base de datos estará accesible en localhost:3306.

### 3. Crear la Tabla en la Base de Datos

Con los contenedores corriendo, abre una nueva terminal y ejecuta el siguiente comando para acceder a la CLI de MySQL:

```bash
docker exec -it mysql_db_empanadas mysql -u user -p
```

Cuando pida la contraseña, introduce: password.
Una vez dentro del prompt mysql>, ejecuta el siguiente script SQL para crear la tabla:

```SQL
USE empanadas_db;

CREATE TABLE empanadas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  filling TEXT,
  price DECIMAL(10, 2),
  is_sold_out BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

exit;
```

### 4. Iniciar el Frontend (CodeIgniter)

En una tercera terminal, navega a la carpeta del frontend y levanta el servidor de desarrollo de PHP.

```bash
cd frontend
sudo apt install php-cli php-xml unzip curl -y   # solo la primera vez
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer install
```

```bash
cd frontend
php spark serve
```

La interfaz de usuario estará disponible en http://localhost:8080.

### 5. Ejecutar las Preras Unitarias

Para verificar la salud del backend, puedes ejecutar la suite de pruebas desde la carpeta backend:

```bash
cd backend
npm test
```
