import { Controller } from '@nestjs/common';

@Controller('match')
export class MatchController {
	constructor( private readonly MatchService : MatchService ) {}

	@Get('/:matchUid')
	@UsePipes(ValidationPipe)
	async getMatch(@Param('matchUid') matchUid : string) : Promise<match> {
		return await this.MatchService.getMatch(matchUid);
	}
}
