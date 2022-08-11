export type User = {
	userId: string;
	userName?: string;
	twoFfactorAuth?: boolean;
	wins?: number;
	losses?: number;
	friends?: User[];
}