# Facturación App

Una aplicación web simple de facturación desarrollada en React. Permite gestionar productos, crear facturas en PDF, mantener un historial y realizar copias de seguridad de los productos.

![facturasuy.netlify.app](https://facturasuy.netlify.app)

## 🚀 Características

- ABM de productos con almacenamiento en `localStorage`
- Generación de facturas en PDF con diseño profesional
- Cálculo de IVA opcional (22%)
- Historial de facturas generadas
- Exportación e importación de productos en formato JSON
- Interfaz moderna y responsiva

## 🛠️ Tecnologías

- React (Vite)
- Tailwind CSS
- jsPDF

## 📄 Uso
 - Productos: Agregá, editá o eliminá productos. Se guardan automáticamente en el navegador.
  
 - Importar/Exportar: Usá los botones al final de la página de productos para guardar un backup (.json) o importar productos desde un archivo.

 - Facturación: Generá facturas, aplicá IVA si corresponde, y descargalas en PDF.

 - Historial: Visualizá y descargá nuevamente facturas generadas previamente.

 ## 💾 Copia de seguridad
   Podés exportar todos los productos a un archivo .json y luego importarlo desde otro navegador o dispositivo para restaurarlos.

 ## 🌐 Deploy
   Este proyecto está desplegado en Netlify:
   🔗 https://facturasuy.netlify.app

 ## 📋 Licencia
   Este proyecto está bajo la licencia MIT.

 ## 📦 Instalación

   Clona el repositorio y ejecuta los siguientes comandos:

```bash
git clone https://github.com/DiegoBaladas/facturacion-app.git
cd facturacion-app
npm install
npm run dev

