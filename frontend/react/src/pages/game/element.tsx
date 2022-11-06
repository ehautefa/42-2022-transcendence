import React from "react"
import { getSocketPong } from "../../Home";

export class PaddleSizeSelector extends React.Component<{paddleSize : number}, {}> {
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
            <div className="ColorSelector">
                <p>Size Paddle :</p>
                <div className="input"><input type="radio" name="size" value="small" onChange={this.onChangeValue} checked={this.props.paddleSize === 10} />Small</div>
                <div className="input"><input type="radio" name="size" value="medium" onChange={this.onChangeValue} checked={this.props.paddleSize === 20} />Medium</div>
                <div className="input"><input type="radio" name="size" value="large" onChange={this.onChangeValue} checked={this.props.paddleSize === 30} />Large</div>
            </div>
        )
    }
}

export class ColorSelector extends React.Component<{ballColor : string}, {}> {
    constructor(props: any) {
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
        console.log("BALL COLOR : " + this.props.ballColor);
    }

    onChangeValue(event: any) {
        const socket = getSocketPong();
        socket.emit("editBallColor", event.target.value);
    }

    render() {
        return (
            <div className="ColorSelector">
                <p>Ball color :</p>
                <div className="input"><input type="radio" value="#FA0197" name="color" onChange={this.onChangeValue} checked={this.props.ballColor === "#FA0197"} />Pink</div>
                <div className="input"><input type="radio" value="#fef45b" name="color" onChange={this.onChangeValue} checked={this.props.ballColor === "#fef45b"} />Yellow</div>
                <div className="input"><input type="radio" value="#DBACE3" name="color" onChange={this.onChangeValue} checked={this.props.ballColor === "#DBACE3"} />Purple</div>
            </div>

        );

    }
}


export interface GameWindowState {
    matchId: string,
    ballX: number,
    ballY: number,
    ballColor: string,
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
