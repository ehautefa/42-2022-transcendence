import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar"
import "./endGame.css"

function Win() {
    return (
        <>
            <NavBar />
            <div className="endGame">
                <h1>You won</h1>
                <Link to="/game">Replay</Link>
            </div>
        </>
    );
}

export default Win;