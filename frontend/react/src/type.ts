export type User = {
	userUuid: string;
	userName: string;
	twoFfactorAuth?: boolean;
	wins?: number;
	losses?: number;
	friends?: User[];
}

export type Match = {
	matchId?: string;
	// user1?: User;
	// user2?: User;
	score1?: number;
	score2?: number;
}

export interface GameWindowState {
	ballX: number,
	ballY: number,
	ballSpeedX: number,
	ballSpeedY: number,
	gameLoopTimeout: number,
	timeoutId: any,
	scoreLeft: number,
	playerLeft: string,
	playerRight: string,
	scoreRight: number,
	paddleLeftY: number,
	paddleLeftX: number,
	paddleRightX: number,
	paddleRightY: number,
	id: number,
	isGameOver: boolean
}