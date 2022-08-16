import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { match } from 'src/bdd/matchs.entity';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/createMatch.dto';

@Injectable()
export class MatchService {
	constructor(
		@InjectRepository(match) private MatchRepository: Repository<match>,
	) { }
	
	async getMatch(matchId: string): Promise<match> {
		return await this.MatchRepository.findOne({ where: { matchId: matchId } });
	}

	async createMatch(matchToCreate: CreateMatchDto): Promise<match> {
		return await this.MatchRepository.save({
			user1: matchToCreate.user1,
			user2: matchToCreate.user2,
		 	score1: 0,
			score2: 0,
		});
	}

	async endOfMatch(endOfMatch): Promise<void> {
		await this.MatchRepository.save({
			matchId: endOfMatch.matchId,
			score1: endOfMatch.score1,
			score2: endOfMatch.score2,
		})
	}
}
