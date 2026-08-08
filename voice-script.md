# CINDY — Copione Eventi Vocali

Modifica i testi nella colonna "Testo attuale", poi chiedi di aggiornarli nel codice.
`{N}` = numero variabile (round, secondi, ecc.)

---

| #  | Momento               | Testo attuale                                                          |
|----|-----------------------|------------------------------------------------------------------------|
| 1  | Premuto Start         | Get ready!                                                             |
| 2  | Countdown — 3         | 3                                                                      |
| 3  | Countdown — 2         | 2                                                                      |
| 4  | Countdown — 1         | 1                                                                      |
| 5  | Via!                  | Go!                                                                    |
| 6  | Inizio round          | Round {N}. {P} pull-ups, {U} push-ups, {S} squats.                     |
| 7  | Fine round            | Round {N} complete. Start round {N+1}.                                 |
| 8  | A 5 minuti            | 5 minutes remaining. Keep pushing!                                     |
| 9  | A 2 minuti            | 2 minutes remaining!                                                   |
| 10 | A 1 minuto            | 1 minute remaining. Give it everything!                                |
| 11 | A 30 secondi          | 30 seconds. Dig deep!                                                  |
| 12 | Conto finale — 10     | 10                                                                     |
| 13 | Conto finale — 9      | 9                                                                      |
| 14 | Conto finale — 8      | 8                                                                      |
| 15 | Conto finale — 7      | 7                                                                      |
| 16 | Conto finale — 6      | 6                                                                      |
| 17 | Conto finale — 5      | 5                                                                      |
| 18 | Conto finale — 4      | 4                                                                      |
| 19 | Conto finale — 3      | 3                                                                      |
| 20 | Conto finale — 2      | 2                                                                      |
| 21 | Conto finale — 1      | 1                                                                      |
| 22 | Pausa                 | Workout paused.                                                        |
| 23 | Ripresa               | Go!                                                                    |
| 24 | Fine workout          | Time's up! Outstanding effort! You completed {N} rounds. Amazing work! |

## Comandi riconosciuti dal microfono

- `next round`
- `prossimo round`
- `prossimo giro`

Il microfono si attiva una volta sola e resta in ascolto durante il workout. Questi sono comandi in ingresso e non vengono pronunciati dall'app.

## Audio registrato

Le clip ricavate dalla registrazione ElevenLabs sono in `voice/`. Il file `voice/manifest.json` contiene testo, timestamp e durata di ogni taglio.

I messaggi fissi usano le clip registrate. Le frasi con valori dinamici (`{N}`, `{P}`, `{U}`, `{S}`) continuano a usare la sintesi vocale del browser, perché la registrazione pronuncia letteralmente i segnaposto.
