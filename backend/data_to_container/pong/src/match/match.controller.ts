import { Body, Controller, Get, Param, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { MatchService } from './match.service';
import { match } from 'src/bdd/matchs.entity';
import { CreateMatchDto } from './dto/createMatch.dto';
import { SaveScoreDto } from './dto/saveScore.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('match')
@Controller('match')
export class MatchController {
	constructor( private readonly MatchService : MatchService ) {}

	/**
	 * Get all matchs of the table
	 */
	@Get('all')
	@ApiOperation({ summary: 'Get all match of the table' })
	@ApiResponse({ status: 200, description: 'Found matchs', type: match })
    async getAllMatch() : Promise<match[]>{
        return await this.MatchService.getAllMatch();
    }

	@Get('/:matchUid')
	@ApiOperation({ summary: 'Get match by matchUid' })
	@ApiResponse({ status: 200, description: 'The found match', type: match})
	@UsePipes(ValidationPipe)
	async getMatch(@Param('matchUid') matchUid : string) : Promise<match> {
		return await this.MatchService.getMatch(matchUid);
	}

	@Get('/user/:userName')
	@ApiOperation({ summary: 'Get match history of the user' })
	@ApiResponse({ status: 200, description: 'Match History of the user', type: match})
	@UsePipes(ValidationPipe)
	async getMatchHistory(@Param('userName') userName : string) : Promise<match[]> {
		return await this.MatchService.getMatchHistory(userName);
	}


	@Post('create')
	@ApiOperation({ summary: 'Create a match with score 0' })
	@ApiParam({ name: 'CreateMatchDto', type: CreateMatchDto })
	@ApiResponse({ status: 200, description: 'The created match', type: match})
	@UsePipes(ValidationPipe)
	async createMatch(@Body() matchToCreate : CreateMatchDto) : Promise<match> {
		return await this.MatchService.createMatch(matchToCreate);
	}

	@Post('saveScore')
	@ApiOperation({ summary: 'Save score at the end of the match' })
	@ApiParam({ name: 'SaveScoreDto', type: SaveScoreDto })	
	@UsePipes(ValidationPipe)
	async saveScore(@Body() saveScore : SaveScoreDto) : Promise<void> {
		return await this.MatchService.endOfMatch(saveScore);
	}
}
