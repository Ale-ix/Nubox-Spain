# NuBox Spain E-commerce

Aplicación de e-commerce moderna desarrollada con Next.js, Firebase y Tailwind CSS.

## 🚀 Despliegue en Netlify

### Pasos para desplegar:

1. **Construir la aplicación:**
   \`\`\`bash
   npm install
   npm run build
   \`\`\`

2. **Subir archivos:**
   - Sube todo el contenido de la carpeta `out/` a tu sitio de Netlify
   - Asegúrate de que el archivo `netlify.toml` esté en la raíz

3. **Configurar Firebase:**
   - Habilita Authentication (Email/Password)
   - Crea base de datos Firestore
   - Habilita Storage
   - Configura las reglas de seguridad

### Estructura de archivos para Netlify:
\`\`\`
/
├── index.html
├── _next/
├── products/
├── cart/
├── auth/
├── admin/
└── netlify.toml
\`\`\`

## 🔧 Configuración

### Variables de entorno (si las necesitas):
Crea un archivo `.env.local`:
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
# ... otras variables
\`\`\`

## 📱 Funcionalidades

- ✅ Catálogo de productos responsivo
- ✅ Carrito de compras con localStorage
- ✅ Autenticación con Firebase
- ✅ Panel de administrador
- ✅ Generación de facturas en PNG
- ✅ Diseño moderno con Tailwind CSS

## 🛠️ Tecnologías

- Next.js 14.2.3
- Firebase 10.7.0
- Tailwind CSS 3.4.13
- html2canvas 1.4.1
- TypeScript
