import { Body, Controller, Get, Param, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { MatchService } from './match.service';
import { match } from 'src/bdd/matchs.entity';
import { CreateMatchDto } from './dto/createMatch.dto';
import { SaveScoreDto } from './dto/saveScore.dto';

@Controller('match')
export class MatchController {
	constructor( private readonly MatchService : MatchService ) {}

	@Get('/:matchUid')
	@UsePipes(ValidationPipe)
	async getMatch(@Param('matchUid') matchUid : string) : Promise<match> {
		return await this.MatchService.getMatch(matchUid);
	}

	@Post('create')
	@UsePipes(ValidationPipe)
	async createMatch(@Body() matchToCreate : CreateMatchDto) : Promise<match> {
		return await this.MatchService.createMatch(matchToCreate);
	}

	@Post('saveScore')
	@UsePipes(ValidationPipe)
	async saveScore(@Body() saveScore : SaveScoreDto) : Promise<void> {
		return await this.MatchService.endOfMatch(saveScore);
	}
}
