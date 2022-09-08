import NavBar from "../../components/NavBar/NavBar"

import "./endGame.css"

function GameOver() {
    return (
        <>
            <NavBar />
            <div className="endGame">
                <h1>Game Over</h1>
                <a href="/match">See all match in Game</a>
            </div>
        </>
    );
}

export default GameOver;