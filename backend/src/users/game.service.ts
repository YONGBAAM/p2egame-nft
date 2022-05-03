import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OnChainService } from "src/transactions/on-chain.service";
import { Repository } from "typeorm";
import { ScoreDto } from "./dto/score.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

export const GANGHWA_COST = 100;

@Injectable()
export class GameService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly onChainService: OnChainService
  ) { 


  };

  probability:number[] = [1,1,0.9,0.5,0.5,0.5,0.01];


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

  async getUsedScore(walletAddress: string): Promise<number> {
    const user = await this.usersService.findUserOrCreate(walletAddress);
    return user.withdrawed_score;
  }

  async getTopScore(): Promise<ScoreDto> {
    const user = await this.usersService.findTopScoreUser();
    return new ScoreDto(user.walletAddress, user.score);
  }

  async gangHwa(walletAddress:string, nftId:number):Promise<boolean> {
    const usedScore = await this
    .getUsedScore(walletAddress);

    const myAllScore = await this.getScore(walletAddress);
    if (myAllScore - usedScore <GANGHWA_COST) {
      throw new Error("No sufficent ganghwa cost");
    }
 
    const currentLevel = await this.onChainService.getLevelOfNft(nftId);
    const rand = Math.random();
    const currentProb = this.probability[Math.min(currentLevel, this.probability.length-1)];

    this.usersService.useScore(walletAddress, GANGHWA_COST);
    if (rand <= currentProb) {
      this.onChainService.increaseLevelOfNft(nftId, 1);
      return true;
    }
    return false;
  }

}