# Resumen del Proyecto

Este proyecto es una aplicación web frontend, construida con Vite, TypeScript, React, shadcn-ui y Tailwind CSS. Está integrado con la plataforma Lovable.dev. El enfoque principal parece ser la construcción de una interfaz de usuario con Tailwind CSS para el estilo.

# Construcción y Ejecución

## Dependencias

El proyecto utiliza `pnpm` como su gestor de paquetes. Para instalar las dependencias necesarias, ejecuta:

```sh
pnpm i
```

## Compilación de Tailwind CSS

Para compilar el CSS de Tailwind, el proyecto utiliza el ejecutable `tailwindcss` directamente desde `node_modules/.bin`. La configuración de `content` en `tailwind.config.js` está configurada para escanear todos los archivos HTML y JavaScript en el proyecto, excluyendo `node_modules`.

### Modo Desarrollo

Para iniciar el proceso de compilación de Tailwind CSS en modo de observación (watch mode), que recompilará automáticamente el CSS cada vez que guardes cambios en tus archivos HTML o JS, usa:

```sh
pnpm run dev:tailwind
```

**Importante**: Debes ejecutar este comando en una terminal separada y mantenerlo en ejecución mientras desarrollas.

### Modo Producción

Para construir el CSS de Tailwind para producción, usa:

```sh
pnpm run build:tailwind
```

## Servidor Local

Para servir los archivos estáticos y ver el proyecto en tu navegador, debes ejecutar el servidor HTTP localmente. Asegúrate de que el proceso de `dev:tailwind` esté corriendo en una terminal separada para que los cambios en el CSS se reflejen automáticamente.

Para iniciar el servidor local, ejecuta:

```sh
pnpm start
```

Esto iniciará un servidor HTTP que servirá los archivos desde el directorio actual. Abre tu navegador y navega a la dirección que te proporcione el servidor (normalmente `http://localhost:8080`).

## Despliegue en Producción

El comando `pnpm start` (que utiliza `http-server`) es adecuado únicamente para el desarrollo local. Para el despliegue en un entorno de producción, se recomienda utilizar soluciones más robustas y optimizadas para servir archivos estáticos, como:

-   **Servidores web dedicados**: Nginx o Apache.
-   **Plataformas de hosting estático**: Netlify, Vercel, GitHub Pages.
-   **Servicios de almacenamiento en la nube con CDN**: AWS S3 + CloudFront, Google Cloud Storage + CDN.

Antes de desplegar en producción, asegúrate de ejecutar `pnpm run build:tailwind` para generar la versión optimizada y minificada de tu CSS de Tailwind.

# Convenciones de Desarrollo

- **Gestor de Paquetes**: `pnpm`
- **Estilo**: Tailwind CSS
- **Framework**: React
- **Lenguaje**: TypeScript
- **Herramienta de Construcción**: Vite
