import { getSocket } from "../../App";

const socket = getSocket();


export function matchMaking() {
    socket.emit('createRoom', {});    
    return (
        <div className="matchMaking">
            <h1>Matchmaking</h1>
        </div>
    );
}