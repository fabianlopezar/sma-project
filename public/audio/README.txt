CARPETA DE AUDIOS DEL PROYECTO
==============================

Aqui van todos los archivos de sonido de la experiencia.

Estructura recomendada:
   public/audio/
     sfx/      -> efectos cortos (click, acierto, error, desbloqueo, fin de juego, etc.)
     music/    -> musica de fondo en loop (intro, expedicion, pantalla final, etc.)

Formato recomendado:
- Para efectos cortos (sfx): MP3 o OGG, mono o stereo, 44.1 kHz.
   Idealmente < 100 KB cada uno.
- Para musica de fondo (music): MP3, 128 kbps suele ser suficiente.
   Idealmente < 2 MB por pista.

Convencion de nombres:
- Solo minusculas, sin espacios. Usar guiones para separar palabras.
- Ejemplos:
   sfx/click.mp3
   sfx/correcto.mp3
   sfx/error.mp3
   sfx/desbloqueo.mp3
   sfx/zona-completada.mp3
   sfx/final.mp3
   music/intro.mp3
   music/expedicion.mp3

Como se referencian desde el codigo:
- Desde React: "/audio/sfx/click.mp3"
- (No incluyas "public/" en la ruta. Vite la sirve directamente.)

Como activar un sonido (cuando me digas cual va donde):
- Para sonidos one-shot (click, acierto, etc.) usamos el hook useSound:
     import { useSound } from '@/hooks/useSound';
     const playClick = useSound('/audio/sfx/click.mp3', { volume: 0.7 });
     <button onClick={() => playClick()}>...</button>

- Para musica de fondo en loop usamos useBackgroundMusic:
     import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
     useBackgroundMusic('/audio/music/expedicion.mp3', { volume: 0.3 });

Nota sobre navegadores:
- Los navegadores modernos NO permiten reproducir audio automaticamente
  hasta que el usuario haga al menos un click/tap en la pagina. Por eso
  la musica de fondo arranca apenas el usuario interactua, no antes.
- Los efectos one-shot (sfx) disparados POR un click ya funcionan inmediatamente.

Recomendaciones para encontrar audios:
- freesound.org           (gratis, requiere atribucion en algunos)
- pixabay.com/sound-effects   (gratis y sin atribucion)
- opengameart.org         (efectos y musica)
- mixkit.co/free-sound-effects   (gratis, calidad alta)
