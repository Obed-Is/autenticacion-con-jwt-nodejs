# 🔐 Autenticación con JSON Web Tokens (JWT) en Node.js

Este proyecto es una aplicación de ejemplo para demostrar cómo implementar un sistema de autenticación seguro utilizando **JSON Web Tokens (JWT)** en un entorno de **Node.js** con **Express**.

## 🚀 Tecnologías Utilizadas

- **Node.js** 🟢
- **Express.js** 🚂 (Framework web)
- **JSON Web Tokens (jsonwebtoken)** 🔑 (Generación y validación de tokens)
- **cookie-parser** 🍪 (Almacenamiento y manejo de cookies para los JWT)
- **db-local** 📦 (Base de datos local ligera)
- **EJS** 📄 (Motor de plantillas para la interfaz de usuario)
- **dotenv** 🔒 (Gestión de variables de entorno)
- **morgan** 🕵️ (Registro y monitoreo de peticiones HTTP en desarrollo)

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:
- [Node.js](https://nodejs.org/) (Incluye npm)

## ⚙️ Instalación y Configuración

Sigue estos sencillos pasos para tener el proyecto funcionando en tu entorno local:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Obed-Is/autenticacion-con-jwt-nodejs.git
   ```

2. **Ingresar a la carpeta del proyecto**  
   Navega a la carpeta que se acaba de crear:
   ```bash
   cd autenticacion-con-jwt-nodejs
   ```

3. **Instalar dependencias**  
   En la terminal, dentro de la carpeta del proyecto, ejecuta:
   ```bash
   npm install
   ```

4. **Configurar las variables de entorno**  
   Si el proyecto requiere variables de entorno (como el puerto o la clave secreta de JWT), asegúrate de crear un archivo `.env` en la raíz del proyecto y configurarlo basándote en el código fuente.
   *(Por ejemplo: `PORT=3000`, `SECRET_JWT_KEY=tu_secreto`)*

5. **Ejecutar el proyecto**  
   Una vez instalado todo correctamente, puedes iniciar el servidor en modo desarrollo (usando `nodemon`) con el siguiente comando:
   ```bash
   npm run dev
   ```

## 🐳 Uso con Docker

Si prefieres ejecutar la aplicación usando Docker, puedes hacerlo definiendo las siguientes variables de entorno:

> Solo se deja la configuración previa a ejecutar docker, porque aun no se ha subido el Dockerfile al repositorio, se subirá próximamente.

- `APP_PORT`: Define el puerto en el que la aplicación se ejecutará (por defecto es `3000`).
- `SECRET_KEY_JWT`: Es la llave secreta utilizada para firmar los JWT.

Ejemplo de cómo correr el contenedor:
```bash
docker build -t auth-jwt-nodejs .
docker run -p 3000:3000 -e APP_PORT=3000 -e SECRET_KEY_JWT=tu_super_secreto auth-jwt-nodejs
```

## 🎉 ¡Listo!

Ya puedes comenzar a interactuar con la aplicación. ¡Disfruta explorando el código y aprendiendo sobre autenticación con JWT! :D