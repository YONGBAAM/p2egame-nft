import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ScoreDto } from "./dto/score.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Injectable()
export class GameService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly usersService: UsersService
  ) { };

  async putScore(walletAddress: string, score: number) {
    const user = await this.usersService.findUserOrCreate(walletAddress);
    if (user.score < score) {
      user.score = score;
      this.userRepository.save(user);
    }
  }

  async getScore(walletAddress: string): Promise<number> {
    const user = await this.usersService.findUserOrCreate(walletAddress);
    return user.score;
  }

  async getTopScore(): Promise<ScoreDto> {
    const user = await this.usersService.findTopScoreUser();
    return new ScoreDto(user.walletAddress, user.score);
  }

}