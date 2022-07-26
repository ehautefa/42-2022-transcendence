import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
    getNB (nb_to_ret : number): string {
        nb_to_ret++;
        return ("nb = " + nb_to_ret);
    }
}
