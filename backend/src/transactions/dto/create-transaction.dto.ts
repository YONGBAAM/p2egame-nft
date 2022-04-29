export class CreateTransactionDto {
  walletAddress: string;
  transactionType: string; // Enum?
  transactionId: string;
  // status:string;
  // blockCount:number = 0; // default value?
}
