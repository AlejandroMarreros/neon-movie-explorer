
#  Neon Movie Explorer

Neon Movie Explorer es una plataforma interactiva de búsqueda cinematográfica que combina una estética Cyberpunk inmersiva con una arquitectura robusta en React 18. El proyecto destaca por su gestión de estado global y una experiencia de usuario (UX) fluida mediante microinteracciones neón.
---

## ✨ Características

-Características Principales

    🔍 Consumo de API Dinámico: Integración con la API de OMDb para búsqueda en tiempo real de películas y series.

    🎭 Experiencia Visual Inmersiva: Interfaz diseñada con efectos de iluminación neón, animaciones fade-in y   transiciones suaves mediante CSS3.

    ⭐ Sistema de Engagement: Calificación interactiva por estrellas y gestión de una lista de favoritos persistente.

    📱 Arquitectura Responsive: Diseño adaptativo garantizado para dispositivos móviles y escritorio.

    🛡️ Moderación de Comunidad: Sistema funcional de comentarios con lógica de reportes y vista de administrador (vía indexAdmin.js).
---

Stack Tecnológico & Arquitectura

La aplicación se construyó siguiendo el principio de Separación de Responsabilidades:

    Frontend Core: React 18 (Hooks y Functional Components).

    Gestión de Estado: Context API para centralizar datos de la API y 
    preferencias del usuario (Favoritos/Rating).

    Enrutamiento: React Router DOM para navegación SPA (Single Page Application).

    Lógica de Negocio: Módulo independiente indexAdmin.js para el manejo
    de lógica CRUD fuera de los componentes.

    Herramientas: Vite (Bundler de alta velocidad), GitHub Pages (Deployment).

---

## ⚙️ Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/AlejandroMarreros/neon-movie-explorer.git

2. Entrar al proyecto
cd neon-movie-explorer
3. Instalar dependencias
npm install
4. Ejecutar en desarrollo
npm run dev

Build para producción
npm run build

Deploy en GitHub Pages
Agrega en package.json:
"homepage": "https://alejandromarreros.github.io/neon-movie-explorer/"

#Instala gh-pages:
npm install gh-pages --save-dev
Agrega scripts en package.json:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
Ejecuta:
npm run deploy

Estilo y diseño
Fondo global en toda la aplicación
Efectos neón en bordes y textos
Animaciones hover y fade-in
UI moderna tipo cyberpunk
Experiencia fluida y responsiva

#Recursos
Fondo: /img/fondo.jpg
API: OMDB API

#Desafíos Técnicos Superados

Optimización de Renderizado: Implementación de efectos fade-in y carga condicional
de imágenes para evitar saltos visuales durante la carga de datos.

Gestión de Estado Global: Sincronización de múltiples componentes
(Favoritos, Detalles, Comentarios) sin incurrir en prop-drilling.

Modularidad: Extracción de la lógica de administración a un controlador dedicado,
permitiendo que la UI se mantenga limpia y escalable.

--

## Autor

Alejandro Marreros Estudiante de Ingeniería de Sistemas y Desarrollador
Frontend apasionado por el software eficiente.
Proyecto personal de práctica con React




# Arquitectura y Estructura del Software

Para este proyecto, diseñé una estructura basada en la Separación de Responsabilidades, dividiendo la lógica de negocio de los componentes de la interfaz.

    Nota: El diagrama superior muestra el flujo de datos desde la entrada del usuario (MainPage), pasando por el estado global (Context API), hasta el consumo de la API externa y la lógica de administración (indexAdmin.js).

📂 Organización de Carpetas

src/
├── App.css           # Estilos CSS y recursos estáticos
├── components/       # Componentes de UI (FormSearch, ItemMovie, etc.)
├── context/          # Manejo de estado global (DataContext, FavoritesContext)
├── hooks/            # Lógica de peticiones (useFetch.js)
├── logic/            # Lógica CRUD independiente (indexAdmin.js)
├── App.jsx           # Enrutador principal
└── main.jsx          # Punto de entrada de la aplicación


<img width="6947" height="2695" alt="React UI Layer Deployment-2026-04-14-123328" src="https://github.com/user-attachments/assets/31438001-d309-46f9-98d3-b2c85fd6f8b4" />
