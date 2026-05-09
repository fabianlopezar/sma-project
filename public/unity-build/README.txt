CARPETA DESTINO DEL BUILD WEBGL DE UNITY
=========================================

Cuando exportes el proyecto SistemaMultimedia desde Unity (File > Build Settings >
WebGL > Build), copia el contenido COMPLETO de la carpeta resultante a esta misma
carpeta. La estructura final debe quedar asi:

  public/unity-build/
    Build/
      Build.loader.js
      Build.data
      Build.framework.js
      Build.wasm
    TemplateData/
      ...
    index.html       <- (no se usa, lo carga sma-project)

Notas:

1) El nombre de los archivos depende del nombre del build. Si Unity los llama
   "WebGL Build.loader.js" en vez de "Build.loader.js", o renombras los archivos
   a Build.* o ajustas las rutas en src/components/UnityGame.tsx.

2) Compresion: si activas Brotli/Gzip en Player Settings, los archivos
   tendran extension .br o .gz. En desarrollo (Vite) suele dar problemas
   porque no manda los headers Content-Encoding correctos. Para la prueba
   inicial, desactiva la compresion en Player Settings > Publishing Settings >
   Compression Format = Disabled.

3) Esta carpeta esta en .gitignore (recomendado) porque los builds suelen
   pesar varias decenas de MB. Cada quien hace su propio build local.
