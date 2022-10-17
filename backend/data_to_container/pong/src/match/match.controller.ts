import { Body, Controller, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MatchService } from './match.service';
import { match } from 'src/bdd/matchs.entity';
import { CreateMatchDto } from './dto/createMatch.dto';
import { SaveScoreDto } from './dto/saveScore.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';

@ApiBearerAuth()
@ApiTags('match')
@Controller('match')
export class MatchController {
	constructor( private readonly MatchService : MatchService ) {}

	@Get('all')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Get all match of the table' })
	@ApiResponse({ status: 200, description: 'Found matchs', type: match })
    async getAllMatch() : Promise<match[]>{
        return await this.MatchService.getAllMatch();
    }

	@Get('/:matchUid')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Get match by matchUid' })
	@ApiResponse({ status: 200, description: 'The found match', type: match})
	@UsePipes(ValidationPipe)
	async getMatch(@Param('matchUid') matchUid : string) : Promise<match> {
		return await this.MatchService.getMatch(matchUid);
	}

	@Get('/user/:userName')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Get match history of the user' })
	@ApiResponse({ status: 200, description: 'Match History of the user', type: match})
	@UsePipes(ValidationPipe)
	async getMatchHistory(@Param('userName') userName : string) : Promise<match[]> {
		console.log("GET MATCH HISTORY", userName);
		return await this.MatchService.getMatchHistory(userName);
	}
}
