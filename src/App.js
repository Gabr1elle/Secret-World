// CSS
import "./App.css";

// REACT
import { useCallback, useEffect, useState } from "react";

// Data
import { wordList, wordsList } from "./data/words";

// Components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

// Quantidade de tentativas por partida
const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  // letras
  const [guessedLetters, setguessedLetters] = useState([]);
  // Letras erradas
  const [wrongLetters, setWrongLetters] = useState([]);
  // Chances de tentativas
  const [guesses, setGuesses] = useState(guessesQty);
  // Pontução
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    // escolher categoria aleatória
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    console.log(category);

    // escolher uma palavra aleatória
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    console.log(word);

    return { word, category };
  }, [words]);
  // Iniciar o jogo
  const startGame = useCallback(() => {
    // apagar letras
    clearLetterStates();

    // escolher palavra/categoria
    const { word, category } = pickWordAndCategory();

    // Matriz de letras
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(word, category);
    console.log(wordLetters);

    // Preencher estados
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // processar a última entrada
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // verificar se a letra já foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // Adicone a letra adivinhada ou remova o palpite
    if (letters.includes(normalizedLetter)) {
      setguessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setguessedLetters([]);
    setWrongLetters([]);
  };
  // verificar se os tentativas terminaram
  useEffect(() => {
    if (guesses <= 0) {
      // redefinir todos os estados
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // verificar a condição de vitoria
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // condição de vitória
    if (
      guessedLetters.length === uniqueLetters.length &&
      gameStage === stages[1].name
    ) {
      // Adicionar score
      setScore((actualScore) => (actualScore += 100));
      // reinicie o jogo com uma nova palavra
      startGame();
    }
  }, [guessedLetters, letters, startGame, gameStage]);

  // reiniciar o jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
