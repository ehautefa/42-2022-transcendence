import NavBar from "../../components/NavBar/NavBar"
import "./endGame.css"

function Lose() {
    return (
        <>
            <NavBar />
            <div className="endGame">
                <h1>You lost</h1>
                <a href="/game">Replay</a>
            </div>
        </>
    );
}

export default Lose;