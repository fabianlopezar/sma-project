CARPETA DE ASSETS PARA PINES/ZONAS DEL MAPA
============================================

Aqui van los iconos personalizados de cada pin que aparece en el mapa de
Expedicion UAO.

Convencion de nombres recomendada:
   pin-<nombre-zona>.png

Ejemplos:
   pin-biblioteca.png
   pin-cafeteria.png
   pin-aulas.png
   pin-deportes.png
   pin-emprendimiento.png

Formato recomendado:
- PNG con transparencia.
- Tamano: idealmente cuadrado, 256x256 px o mayor.
- Peso: por debajo de 100 KB si es posible (usa tinypng.com si pesa mucho).

Como se referencian desde el codigo:
- Desde React: src="/img/pines/pin-biblioteca.png"
  (la carpeta "public" no se incluye en la ruta; "/img/pines/..." es
   suficiente y Vite la sirve directamente).

Cuando agregues un asset nuevo:
1. Copialo a esta carpeta.
2. Avisame el nombre y a que zona corresponde.
3. Actualizo el array `zones` en src/components/ExpedicionUAOview.tsx
   para que el pin de esa zona use la nueva imagen.

Si todavia no hay asset para una zona, el pin se queda con el icono
generico de lucide-react que tiene por defecto. Es perfectamente
funcional, solo menos personalizado.
