export class ScoreDto {
  constructor(account: string, score: number) {
    this.account = account;
    this.score = score;
  }

  account: string;
  score: number;
}
