import React from "react"
import { getSocketPong } from "../../Home";

export class Ball extends React.Component<{ x: number, y: number }> {
    render() {
        return <div
            style={{
                top: `${this.props.y}%`,
                left: `${this.props.x}%`,
            }}
            className="Ball" id="ball" />
    }
}

export class Paddle extends React.Component<{ x: number, y: number, size: number }> {
    render() {
        return <div
            style={{
                top: `${this.props.y}%`,
                left: `${this.props.x}vw`,
                height: `${this.props.size}%`,
            }}
            className="Paddle" />
    }
}

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
            <div className="containers-paddle-size-select">
                <p>Size Paddle :</p>
                <select className="select-paddle-size-select" onChange={this.onChangeValue}>
                    <option className="option-paddle-size-select" value="small">Small</option>
                    <option className="option-paddle-size-select" value="medium">Medium</option>
                    <option className="option-paddle-size-select" value="large">Large</option>
                </select>
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
