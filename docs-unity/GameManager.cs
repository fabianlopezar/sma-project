// COPIAR ESTE ARCHIVO A:
//   SistemaMultimedia/Assets/Scripts/GameManager.cs
//
// GameManager: el "router" del puente Unity <-> React.
//
// Setup:
// 1. Crear una escena "Bootstrap" (la primera que se carga al abrir el WebGL).
// 2. En Bootstrap, crear un GameObject vacio llamado EXACTAMENTE "GameManager"
//    y adjuntarle este script.
// 3. Agregar Bootstrap como PRIMERA escena en File > Build Settings.
// 4. Agregar las demas escenas de minijuegos despues (JuegoCafeteria, etc.).
//
// React llama:           sendMessage("GameManager", "StartMiniGame", "cafeteria")
// Unity responde con:    ReactNotifyGameOver("cafeteria")    (cuando termine el juego)

using UnityEngine;
using UnityEngine.SceneManagement;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    // Singleton: facilita encontrar la instancia desde los minijuegos
    public static GameManager Instance { get; private set; }

#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")] private static extern void ReactNotifyReady();
    [DllImport("__Internal")] private static extern void ReactNotifyGameOver(string gameId);
#else
    // Stubs para que compile y debuguee en el Editor de Unity
    private static void ReactNotifyReady() {
        Debug.Log("[Editor] ReactNotifyReady (en WebGL real, avisa a React)");
    }
    private static void ReactNotifyGameOver(string gameId) {
        Debug.Log($"[Editor] ReactNotifyGameOver gameId={gameId} (en WebGL real, avisa a React)");
    }
#endif

    // Mapeo de gameId (lo que envia React) -> nombre exacto de escena de Unity.
    // El gameId debe coincidir EXACTO con el que envia la web.
    // El nombre de escena debe coincidir EXACTO con el archivo .unity (sin extension).
    private readonly Dictionary<string, string> gameIdToScene = new Dictionary<string, string>
    {
        { "cafeteria",   "JuegoCafeteria" },
        { "biblioteca",  "JuegoBiblioteca" },
        { "laboratorio", "JuegoLaboratorio" },
        // Agrega aqui los demas minijuegos conforme los crees.
    };

    // El gameId del minijuego actualmente cargado.
    // Se guarda para saber a quien "atribuir" el FinishGame.
    private string currentGameId;

    void Awake()
    {
        // Singleton + persistencia entre escenas
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    void Start()
    {
        ReactNotifyReady();
        Debug.Log("[GameManager] Listo. Esperando comandos de React.");
    }

    // ============================================================
    // METODOS LLAMADOS DESDE REACT (via sendMessage)
    // ============================================================

    /// <summary>
    /// React llama: sendMessage("GameManager", "StartMiniGame", "cafeteria")
    /// Carga la escena del minijuego correspondiente.
    /// </summary>
    public void StartMiniGame(string gameId)
    {
        Debug.Log($"[GameManager] StartMiniGame recibido: {gameId}");
        currentGameId = gameId;

        if (gameIdToScene.TryGetValue(gameId, out string sceneName))
        {
            SceneManager.LoadScene(sceneName);
        }
        else
        {
            Debug.LogError($"[GameManager] gameId desconocido: '{gameId}'. " +
                           $"Agregalo al diccionario gameIdToScene.");
        }
    }

    // ============================================================
    // METODO QUE LLAMAN LOS MINIJUEGOS (al terminar la fase)
    // ============================================================

    /// <summary>
    /// Lo llama el minijuego cuando el jugador termina la fase.
    ///
    /// Desde un script de minijuego (C#):
    ///     GameManager.Instance.FinishGame();
    ///
    /// Desde un boton en la escena (sin codigo):
    ///     OnClick() -> arrastra el GameObject "GameManager" -> elige GameManager.FinishGame
    /// </summary>
    public void FinishGame()
    {
        Debug.Log($"[GameManager] FinishGame: gameId={currentGameId}");

        // 1. Avisar a React que la fase termino
        ReactNotifyGameOver(currentGameId ?? "unknown");

        // 2. Volver a la escena Bootstrap (libera memoria del minijuego)
        SceneManager.LoadScene("Bootstrap");

        currentGameId = null;
    }

    // ============================================================
    // UTILIDADES DE DEBUG (solo en Editor)
    // ============================================================

    [ContextMenu("Test: simular FinishGame")]
    public void DebugTriggerGameOver()
    {
        currentGameId = currentGameId ?? "cafeteria";
        FinishGame();
    }
}
