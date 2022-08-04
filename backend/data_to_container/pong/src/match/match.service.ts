import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { matchDto } from './match.dto';
import { match } from '../bdd/matchs.entity'

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(match) private q: Repository<match>) { }

    async postMatch(match: matchDto): Promise<match> {

        const new_match = await this.q.save(match);
        return new_match;
    }
}