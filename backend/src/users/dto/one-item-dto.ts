
export class OneItemDto {
  constructor(nftId: string, grade: number) {
    this.nftId = nftId;
    this.grade = grade;
  };
  nftId: string;
  grade: number;
}