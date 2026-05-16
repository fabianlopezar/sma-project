// COPIAR ESTE ARCHIVO A:
//   SistemaMultimedia/Assets/Plugins/WebGL/ReactBridge.jslib
//
// Puente Unity -> JavaScript (React).
// Unity llama a estas funciones, y ellas disparan eventos que React escucha.

mergeInto(LibraryManager.library, {

  // Avisa a React que la escena ya esta lista para recibir comandos.
  ReactNotifyReady: function () {
    if (typeof window.dispatchReactUnityEvent === "function") {
      window.dispatchReactUnityEvent("GameReady");
    }
  },

  // Avisa a React que el minijuego termino.
  // Solo manda el gameId (que minijuego termino). Sin score, sin xp.
  ReactNotifyGameOver: function (gameIdPtr) {
    var gameId = UTF8ToString(gameIdPtr);
    if (typeof window.dispatchReactUnityEvent === "function") {
      window.dispatchReactUnityEvent("GameOver", gameId);
    }
  }

});
