// COPIAR ESTE ARCHIVO A:
//   SistemaMultimedia/Assets/Plugins/WebGL/ReactBridge.jslib
//
// Es el "puente" para que Unity llame a JavaScript en el navegador.
// react-unity-webgl expone window.dispatchReactUnityEvent(name, ...args);
// nosotros lo invocamos desde aqui.

mergeInto(LibraryManager.library, {

  // Avisa a React que la escena ya esta lista para recibir comandos.
  ReactNotifyReady: function () {
    if (typeof window.dispatchReactUnityEvent === "function") {
      window.dispatchReactUnityEvent("GameReady");
    }
  },

  // Notifica a React que el minijuego termino, con score/xp.
  // Los strings vienen como punteros y se convierten con UTF8ToString.
  ReactNotifyGameOver: function (gameIdPtr, score, xp) {
    var gameId = UTF8ToString(gameIdPtr);
    if (typeof window.dispatchReactUnityEvent === "function") {
      window.dispatchReactUnityEvent("GameOver", gameId, score, xp);
    }
  }

});
