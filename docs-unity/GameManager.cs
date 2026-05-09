// COPIAR ESTE ARCHIVO A:
//   SistemaMultimedia/Assets/Scripts/GameManager.cs
//
// Y crear en la escena un GameObject vacio llamado EXACTAMENTE "GameManager"
// con este script adjunto.
//
// React llama a:    sendMessage("GameManager", "StartMiniGame", "memorama")
// Unity responde con: ReactNotifyGameOver("memorama", 100, 25)

using UnityEngine;
using System.Runtime.InteropServices;

public class GameManager : MonoBehaviour
{
    // Importa las funciones definidas en ReactBridge.jslib.
    // Estas declaraciones SOLO funcionan en el build WebGL real;
    // en el editor de Unity hay que envolverlas en #if.

#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")] private static extern void ReactNotifyReady();
    [DllImport("__Internal")] private static extern void ReactNotifyGameOver(string gameId, int score, int xp);
#else
    private static void ReactNotifyReady() { Debug.Log("[Editor] ReactNotifyReady"); }
    private static void ReactNotifyGameOver(string gameId, int score, int xp) {
        Debug.Log($"[Editor] ReactNotifyGameOver gameId={gameId} score={score} xp={xp}");
    }
#endif

    private string currentGameId;

    void Start()
    {
        // Avisamos al React de afuera que ya estamos listos.
        ReactNotifyReady();
    }

    /// <summary>
    /// Lo llama React con: sendMessage("GameManager", "StartMiniGame", "<id>")
    /// </summary>
    public void StartMiniGame(string gameId)
    {
        currentGameId = gameId;
        Debug.Log($"[Unity] StartMiniGame recibido: {gameId}");

        // Aqui mete tu logica real: cargar la escena del minijuego, etc.
        switch (gameId)
        {
            case "memorama":
                // SceneManager.LoadScene("MemoramaScene");
                break;
            case "trivia":
                // SceneManager.LoadScene("TriviaScene");
                break;
            case "puzzle":
                // SceneManager.LoadScene("PuzzleScene");
                break;
            default:
                Debug.LogWarning($"[Unity] gameId desconocido: {gameId}");
                break;
        }
    }

    /// <summary>
    /// Llamala desde el minijuego cuando el jugador termina.
    /// Por ejemplo: FindObjectOfType&lt;GameManager&gt;().FinishGame(120, 30);
    /// </summary>
    public void FinishGame(int score, int xp)
    {
        ReactNotifyGameOver(currentGameId ?? "", score, xp);
    }

    // Boton de prueba: simula que el juego termino con score 100 y xp 25.
    // Util para validar la comunicacion antes de tener un minijuego real.
    [ContextMenu("Test GameOver")]
    public void DebugTriggerGameOver()
    {
        ReactNotifyGameOver(currentGameId ?? "test", 100, 25);
    }
}
