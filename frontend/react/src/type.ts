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
	scoreLeft: number,
	playerLeftName: string,
	playerRightName: string,
	scoreRight: number,
	id: number,
	isGameOver: boolean
}