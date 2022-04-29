import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ScoreDto } from "./dto/score.dto";
import { GameService } from "./game.service";

@Controller("game")
export class GameController {
  constructor(private gameService: GameService) { };

  @Get("my-topscore/:account")
  async getMyScore(@Param("account") account: string) {
    const score = await this.gameService.getScore(account);
    return new ScoreDto(account, score);
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
}