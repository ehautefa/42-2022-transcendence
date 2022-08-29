import NavBar from "../../components/NavBar/NavBar"
import "./endGame.css"

function Win() {
    return (
        <>
            <NavBar />
            <div className="endGame">
                <h1>You won</h1>
                <a href="/game">Replay</a>
            </div>
        </>
    );
}

export default Win;