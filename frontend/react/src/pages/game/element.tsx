import React from "react"
import { getSocketPong } from "../../Home";

export class PaddleSizeSelector extends React.Component {
    constructor(props: any) {
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    onChangeValue(event: any) {
        const socket = getSocketPong();
        socket.emit("editPaddleSize", event.target.value);
    }


    render() {
        return (
            <div className="ColorSelector" onChange={this.onChangeValue}>
                <p>Size Paddle :</p>
                <input type="radio" name="size" value="small" /> Small
                <input type="radio" name="size" value="medium" /> Medium
                <input type="radio" name="size" value="large" /> Large
            </div>
        )
    }
}

export class ColorSelector extends React.Component {
    constructor(props: any) {
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    onChangeValue(event: any) {
        document.getElementById("ball")!.style.backgroundColor = event.target.value;
    }

    render() {
        return (
            <div className="ColorSelector" onChange={this.onChangeValue}>
                <p>Ball color :</p>
                <input type="radio" value="#FA0197" name="color" /> Pink
                <input type="radio" value="#fef45b" name="color" /> Yellow
                <input type="radio" value="#DBACE3" name="color" /> Purple
            </div>

        );

    }
}


export interface GameWindowState {
    matchId: string,
    ballX: number,
    ballY: number,
    timeoutId: any,
    scoreLeft: number,
    scoreRight: number,
    paddleLeftY: number,
    paddleRightY: number,
    paddleSize: number,
    isGameOver: boolean,
    playerLeft: string,
    playerRight: string,
    matchMaking: boolean,
    playerLeftName: string,
    playerRightName: string
}
