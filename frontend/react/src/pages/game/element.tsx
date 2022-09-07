import React, { useEffect } from "react"

var ball_color = "#FFF";


export class Ball extends React.Component<{ x: number, y: number }> {
    render() {
        return <div
            style={{
                top: `${this.props.y}%`,
                left: `${this.props.x}%`,
            }}
            className="Ball" id="ball"/>
    }
}

export class Paddle extends React.Component<{ x: number, y: number }> {
    render() {
        return <div
            style={{
                top: `${this.props.y}%`,
                left: `${this.props.x}vw`,
            }}
            className="Paddle" />
    }
}

export class ColorSelector extends React.Component {
    constructor(props: any) {
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    onChangeValue(event: any) {
        ball_color = event.target.value;
        console.log("BALL COLOR",ball_color);
        document.getElementById("ball")!.style.backgroundColor = ball_color;
    }

    render() {
        return (
            <div className= "ColorSelector" onChange={this.onChangeValue}>
                <input type="radio" value="#FA0197" name="color" /> Pink
                <input type="radio" value="#fef45b" name="color" /> Yellow
                <input type="radio" value="#DBACE3" name="color" /> Purple
            </div>

        );

    }
}


export interface GameWindowState {
    ballX: number,
    ballY: number,
    timeoutId: any,
    scoreLeft: number,
    scoreRight: number,
    paddleLeftY: number,
    paddleRightY: number,
    id: number,
    isGameOver: boolean,
    playerLeft: string,
    playerRight: string,
    loading: boolean,
    matchMaking: boolean,
    playerLeftName: string,
    playerRightName: string
}
