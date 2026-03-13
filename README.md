🌤️ Next.js Weather Application

Una aplicación web interactiva para consultar el clima actual de cualquier ciudad. Desarrollada como solución a la prueba técnica, cumpliendo estrictamente con los requerimientos de UI, manejo de errores y cobertura de pruebas.

✨ Características Implementadas

De acuerdo a los requisitos del proyecto, la aplicación incluye:

Búsqueda Precisa: Input y botón de búsqueda para consultar ciudades a nivel mundial.

Información Detallada: Visualización en tiempo real de la Temperatura, Humedad y Descripción del estado del clima.

Manejo de Errores (UX): Validación y feedback visual claro cuando el usuario ingresa una ciudad no válida o inexistente.

Sin fricción de API Keys: Se optó por utilizar la API de Open-Meteo en lugar de OpenWeatherMap. Esto permite que cualquier evaluador pueda clonar, instalar y correr el proyecto inmediatamente sin necesidad de configurar variables de entorno o generar API Keys.

🛠️ Tecnologías y Arquitectura

Framework: Next.js (React)

Peticiones HTTP: Axios

Testing: Jest + React Testing Library

API de Datos: Combinación de Geocoding API (para coordenadas) y Forecast API (para clima) de Open-Meteo.

🚀 Instrucciones de Ejecución

Sigue estos pasos para levantar el entorno de desarrollo local:

Clona el repositorio:

git clone https://github.com/elunadanilo/WeatherApp.git

Instala las dependencias:

npm install


Inicia el servidor de desarrollo:

npm run dev


La aplicación estará disponible en http://localhost:3000.

🧪 Pruebas Unitarias y Cobertura

La fiabilidad de la aplicación está garantizada mediante pruebas unitarias rigurosas, enfocadas en el comportamiento del usuario y los casos límite.

Se han cubierto los siguientes escenarios requeridos:

Renderizado y funcionamiento correcto de los inputs y botones.

Visualización exitosa de los datos del clima tras una búsqueda válida.

Manejo y renderizado correcto de errores (ej. ciudad inválida).

Ejecutar las pruebas

Para correr la suite de pruebas completa:

npm run test


Para generar y visualizar el reporte de cobertura (Coverage objetivo: >80%):

npm run test:coverage
