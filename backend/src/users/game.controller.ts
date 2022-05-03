import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { OnChainService } from "src/transactions/on-chain.service";
import { ScoreDto } from "./dto/score.dto";
import { GameService } from "./game.service";

@Controller("game")
export class GameController {
  constructor(private gameService: GameService,
    private onChainService:OnChainService
    ) { };

  @Get("level/:nftId")
  async getLevelOfNft(@Param("nftId") nftID: number) {
    const score = await this.onChainService.getLevelOfNft(nftID);
    return score;
  }

  // for debug, do not use in frontend
  @Put("level/:nftId/:amount")
  async increaseLevelOfNft(
    @Param("nftId") nftID: number,
    @Param("amount") amount:number
    ) {
    if (process.env.NODE_ENV === "development"){

    }else {
      throw new Error("NO USE THIS")
    }
    const score = await 
    this.onChainService.increaseLevelOfNft(nftID, amount);
    return score;
  }

  @Get("my-topscore/:account")
  async getMyScore(@Param("account") account: string) {
    const score = await this.gameService.getScore(account);
    return score;
  }

  @Get("my-usedscore/:account")
  async getMyUsedScore(@Param("account") account: string) {
    return this.gameService.getUsedScore(account);
  }

  @Put("my-usedscore/:account/:amount")
  async putMyUsedScore(@Param("account") account: string, @Param("amount") amount: number) {
    const score = await this.gameService.getScore(account);
    return new ScoreDto(account, score);
  }

  @Put("my-topscore/:account/:amount")
  async putMyTopScore(@Param("account") account: string, @Param("amount") amount: number) {
    const score = await this.gameService.putScore(account, amount);
  }

  @Post("my-topscore")
  async postMyScore(@Body() dto: ScoreDto) {
    const score = await this.gameService.putScore(dto.account, dto.score)
  }

  @Get("topscore")
  async getTopScore(): Promise<ScoreDto> {
    const topScoreDto = this.gameService.getTopScore();
    return topScoreDto;
  }

  @Put("ganghwa/:wallet/:nftId")
  async ganghwa(
    @Param("wallet") wallet: string,
    @Param("nftId") nftId:number
    ) {
    return this.gameService.gangHwa(wallet, nftId);
  }
}