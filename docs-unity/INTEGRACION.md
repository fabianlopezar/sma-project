# Guía de integración Unity ↔ sma-project

## Idea general

```
sma-project (web)  ◄─────────────►  Unity WebGL
   React/Vite          react-unity-webgl
```

- React monta el build WebGL de Unity dentro de un componente.
- React → Unity: `sendMessage("GameManager", "StartMiniGame", "memorama")`.
- Unity → React: archivo `.jslib` que llama `window.dispatchReactUnityEvent("GameOver", id, score, xp)`.

## Lado React (sma-project) — ya está listo

1. Instalar la librería:
   ```sh
   npm install react-unity-webgl
   ```
2. Levantar el dev server:
   ```sh
   npm run dev
   ```
3. Abrir `http://localhost:8080/minijuego` y hacer click en alguno de los botones.

Archivos involucrados (ya creados):
- `src/components/UnityGame.tsx` — componente que monta Unity.
- `src/pages/MiniGamePage.tsx` — página de prueba con 3 botones.
- `src/App.tsx` — ruta `/minijuego` agregada.
- `public/unity-build/` — aquí se copia el build de Unity.

## Lado Unity (SistemaMultimedia)

1. Copiar `ReactBridge.jslib` a `Assets/Plugins/WebGL/ReactBridge.jslib`
   (crear las carpetas si no existen).
2. Copiar `GameManager.cs` a `Assets/Scripts/GameManager.cs`.
3. Abrir la escena inicial. Crear un GameObject vacío llamado **exactamente**
   `GameManager` y arrastrarle el script `GameManager.cs`.
4. `File > Build Settings`. Plataforma: **WebGL**. Switch Platform.
5. `Player Settings > Publishing Settings`:
   - Compression Format = **Disabled** (para la primera prueba).
   - Decompression Fallback = activo (opcional).
6. `Build`. Carpeta destino: cualquiera, p. ej. `~/Desktop/unity-build/`.
7. Copiar el contenido de esa carpeta a:
   `sma-project/public/unity-build/`
   con la estructura:
   ```
   public/unity-build/
     Build/
       Build.loader.js
       Build.data
       Build.framework.js
       Build.wasm
     TemplateData/...
   ```
8. Si los archivos se llaman distinto (p. ej. `WebGL Build.loader.js`),
   ajustar `loaderUrl/dataUrl/frameworkUrl/codeUrl` en
   `src/components/UnityGame.tsx`.

## Cómo validar que funciona

1. **React → Unity**: en la consola del navegador, al click de un botón,
   debe aparecer en la consola de Unity (logs del `Application.Log`):
   `[Unity] StartMiniGame recibido: memorama`.
2. **Unity → React**: llamar `FinishGame(score, xp)` desde cualquier script
   Unity. En el navegador debería aparecer el cuadro verde
   "Resultado recibido desde Unity" en `/minijuego`.
3. Para probar **Unity → React** sin tener un minijuego completo:
   en el inspector del GameObject `GameManager`, click derecho sobre el
   componente y elegir `Test GameOver`. Eso dispara el callback.

## Troubleshooting

| Síntoma | Causa probable |
|---|---|
| `Failed to fetch ... Build.loader.js` | El build no está en `public/unity-build/Build/` o los nombres no coinciden. |
| `Cannot enlarge memory arrays` | Subir el heap en Player Settings > WebGL > Memory Size. |
| `SharedArrayBuffer is not defined` | Vite necesita headers COOP/COEP. Suele pasar solo si activas threads en Unity. |
| `MIME type ... is not executable` | Compresión activada sin headers correctos. Pon compresión en Disabled. |
| Botón no hace nada y no hay logs | El GameObject no se llama exactamente `GameManager`, o la escena no es la inicial. |

## Buenas prácticas

- Mantener `public/unity-build/` en `.gitignore`. Cada quien hace build local
  o subir el build solo en releases (Git LFS si pesa mucho).
- Para producción: activar compresión Brotli y configurar el host (Vercel,
  Netlify, etc.) para servir `Content-Encoding: br`.
- Estandarizar el contrato de eventos en un solo lugar (este archivo). Si
  agregan eventos nuevos, actualizar `ReactBridge.jslib` y `UnityGame.tsx`.
