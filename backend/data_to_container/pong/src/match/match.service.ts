import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { match } from 'src/bdd/matchs.entity';
import { user } from 'src/bdd/users.entity';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/createMatch.dto';
import { SaveScoreDto } from './dto/saveScore.dto';
import { UserService } from 'src/user/user.service';
import { ArgUndefinedException } from 'src/exceptions/user.exception';


@Injectable()
export class MatchService {
	@Inject(UserService)
	private readonly userService: UserService;
	constructor(
		@InjectRepository(match) private MatchRepository: Repository<match>,
	) { }

	async getAllMatch(): Promise<match[]> {
		return await this.MatchRepository.find({
			relations: {
				user1: true,
				user2: true
			}});
	}

	async getMatch(matchId: string): Promise<match> {
		return await this.MatchRepository.findOne({ where: { matchId: matchId } });
	}

	async getMatchHistory(userName: string): Promise<match[]> {
		if (!userName)
			throw new ArgUndefinedException('userName');
		return await this.MatchRepository.find({
			relations: { // permet de recuperer les users
				user1: true,
				user2: true
			},
			where: [
				{ user1: { userName: userName }, score1: 10 },
				{ user2: { userName: userName }, score1: 10 },
				{ user1: { userName: userName }, score2: 10 },
				{ user2: { userName: userName }, score2: 10 },
			]
		});
	}

	async createMatch(matchToCreate: CreateMatchDto): Promise<match> {
		var user1: user = await this.userService.getUser(matchToCreate.user1uid);
		var user2: user = await this.userService.getUser(matchToCreate.user2uid);
		if (!user1 || !user2)
			throw new ArgUndefinedException('user1 or user2');
		return await this.MatchRepository.save({
			user1: user1,
			user2: user2,
			score1: 0,
			score2: 0,
		});
	}

	async deleteMatch(matchId: string) {
		await this.MatchRepository.delete({ matchId: matchId });
	}

	async endOfMatch(saveScore: SaveScoreDto): Promise<void> {
		if (saveScore.score1 > saveScore.score2)
			await this.userService.endOfMatch(saveScore.player2Uuid, saveScore.player1Uuid)
		else
			await this.userService.endOfMatch(saveScore.player1Uuid, saveScore.player2Uuid)
		await this.MatchRepository.increment({ matchId: saveScore.matchId }, "score1", saveScore.score1);
		await this.MatchRepository.increment({ matchId: saveScore.matchId }, "score2", saveScore.score2);
	}
}
