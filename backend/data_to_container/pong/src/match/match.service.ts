import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { match } from 'src/bdd/matchs.entity';
import { user } from 'src/bdd/users.entity';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/createMatch.dto';
import { SaveScoreDto } from './dto/saveScore.dto';
import { UserService } from 'src/user/user.service';


@Injectable()
export class MatchService {
	@Inject(UserService)
	private readonly userService : UserService;
	constructor(
		@InjectRepository(match) private MatchRepository: Repository<match>,
	) { }

	async getAllMatch(): Promise<match[]> {
		return await this.MatchRepository.find({});
	}
	
	async getMatch(matchId: string): Promise<match> {
		return await this.MatchRepository.findOne({ where: { matchId: matchId } });
	}

	async getMatchHistory(userUid: string): Promise<match[]> {
		return await this.MatchRepository.findBy([
			{user1 : {userUuid: userUid}},
			{user2 : {userUuid: userUid}}
		]);
	}

	async createMatch(matchToCreate: CreateMatchDto): Promise<match> {
		console.log("Try to create match", matchToCreate);
		var user1: user = await this.userService.getUser(matchToCreate.user1uid);
		var user2: user = await this.userService.getUser(matchToCreate.user2uid);
		return await this.MatchRepository.save({
			user1: user1,
			user2: user2,
			score1: 0,
			score2: 0,
		});
	}

	async endOfMatch(saveScore: SaveScoreDto): Promise<void> {
		console.log("END OF MATCH", saveScore);
		if (saveScore.score1 > saveScore.score2) {
			await this.userService.endOfMatch(
				{winnerUuid : saveScore.player1Uuid, loserUuid : saveScore.player2Uuid})
		} else {
			await this.userService.endOfMatch(
				{winnerUuid : saveScore.player2Uuid, loserUuid : saveScore.player1Uuid})
		}
		await this.MatchRepository.increment({ matchId: saveScore.matchId }, "score1", saveScore.score1);
		await this.MatchRepository.increment({ matchId: saveScore.matchId }, "score2", saveScore.score2);
	}
}