import { useState } from "react";
export default function SimonSays() {
  const [level, setLevel] = useState(0);

  //This state keeps track of which out of the four buttons to flash
  const [btnFlash, setBtnFlash] = useState([
    { 1: false },
    { 2: false },
    { 3: false },
    { 4: false },
  ]);

  //This state is storing the button indixes of the buttons flashed by the game
  const [gameSequence, setGameSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);

  const [hasGameStarted, setHasGameStarted] = useState(false);

  const [isBgRed, setIsBgRed] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const [highestScore, setHighestScore] = useState(0);
  const flashStyle = {
    backgroundColor: "white",
  };

  function levelUp() {
    //Change the level state
    setLevel((prevValue) => prevValue + 1);

    //Set the value of score (since the level state has not been updated yet, on every level up, score of the last round will get added)
    setScore((prevScore)=> prevScore + level);

    //Choose a random button out of the 4 buttons
    let randomBtnNum = Math.floor(Math.random() * 4);

    //Flash the random button
    setTimeout(() => {
      flashButton(randomBtnNum);
    }, 500);

    //Add the random button to the game sequence
    setGameSequence((prevValue) => {
      return [...prevValue, randomBtnNum];
    });

    //Update the player sequence
    setPlayerSequence([]);
  }

  function flashButton(btn) {
    //btn is number between 0 and 3
    //Make the bg-color white
    setBtnFlash((prevValue) => {
      const newBtnFlash = [...prevValue];
      newBtnFlash[btn] = { [btn + 1]: true };
      return newBtnFlash;
    });
    setTimeout(() => {
      //Set the bg-color back to original color
      setBtnFlash((prevValue) => {
        const newBtnFlash = [...prevValue];
        newBtnFlash[btn] = { [btn + 1]: false };
        return newBtnFlash;
      });
    }, 200);
  }

  function resetGame() {
    setLevel(0);
    setGameSequence([]);
    setPlayerSequence([]);
    setHasGameStarted(false);
    setIsGameOver(false);
    setScore(0);
  }

  //Step 1: Start or Reset the game depending on the value of hasGameStarted
  function startReset() {
    //Check if the game has already begun
    if (!hasGameStarted) {
      setHasGameStarted(true);
      levelUp();
    } else {
      resetGame();
    }
  }

  // This function matches the two sequences
  function matchSequence(btn) {
    let newPlayerSequence = [...playerSequence];
    newPlayerSequence.push(btn);
    for (let i = 0; i < newPlayerSequence.length; i++) {
      if (newPlayerSequence[i] !== gameSequence[i]) {
        return false;
      }
    }
    return true;
  }

  function handlePlayerClick(btn) {
    //Flash the clicked button
    flashButton(btn);

    //Add the btn to the playerSequence
    setPlayerSequence((prevValue) => {
      let newPlayerSequence = [...prevValue];
      newPlayerSequence.push(btn);
      return newPlayerSequence;
    });
   
    //Match the playerSquence with gameSequence
    if (!matchSequence(btn)) {
      //Flash red Color in the background
      setIsBgRed(true);
      setTimeout(() => {
        setIsBgRed(false);
      }, 200);

      //Set isGameOver to true
      setIsGameOver(true);

      //Set and check highest score
      if(score>highestScore){
        setHighestScore(score);
      }
      return;
    }
    if (playerSequence.length + 1 == gameSequence.length) {
      levelUp();
    }
  }

  return (
    <main style={{ backgroundColor: isBgRed ? "red" : "" }}>
      <p className="highestScore">Highest Score: {highestScore}</p>
      <h1>Simon Says</h1>
      <h4 className="level">
        {!hasGameStarted
          ? "Press 'Start' to begin the game"
          : (!isGameOver
          ? `Level ${level}`
          : `GAME OVER!!! Your Score is ${score}`)}
      </h4>

      <div className="game-buttons">
        <button
          onClick={() => handlePlayerClick(0)}
          style={btnFlash[0][1] ? flashStyle : {}}
          className="btn btn-1"
        ></button>
        <button
          onClick={() => handlePlayerClick(1)}
          style={btnFlash[1][2] ? flashStyle : {}}
          className="btn btn-2"
        ></button>
        <button
          onClick={() => handlePlayerClick(2)}
          style={btnFlash[2][3] ? flashStyle : {}}
          className="btn btn-3"
        ></button>
        <button
          onClick={() => handlePlayerClick(3)}
          style={btnFlash[3][4] ? flashStyle : {}}
          className="btn btn-4"
        ></button>
        <button onClick={startReset} className="start-reset">
          {hasGameStarted ? "Reset" : "Start"}
        </button>
      </div>
    </main>
  );
}
