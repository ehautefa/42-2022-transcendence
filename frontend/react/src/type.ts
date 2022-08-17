export type User = {
	userUuid: string;
	userName?: string;
	twoFfactorAuth?: boolean;
	wins?: number;
	losses?: number;
	friends?: User[];
}

export interface GameWindowState {
	ballX: number,
	ballY: number,
	ballSpeedX: number,
	ballSpeedY: number,
	gameLoopTimeout: number,
	timeoutId: any,
	scoreLeft: number,
	scoreRight: number,
	paddleLeftY: number,
	paddleLeftX: number,
	paddleRightX: number,
	paddleRightY: number,
	id: number,
	isGameOver: boolean
}