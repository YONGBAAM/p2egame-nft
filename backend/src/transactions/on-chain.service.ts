import { mintAnimalTokenContract, web3 } from '../web3Config'
import { OnChainTransactionStatus } from './dto/on-chain-transaction-status.dto';
import { changgo_address, changgo_private_key } from '../web3Config'
import { TransactionReceipt } from 'web3-eth'
import { Logger } from '@nestjs/common';
import { toBN } from 'web3-utils';
import Web3 from 'web3';

/*
Unlike transaction service, This is adapter to block chain
*/
export class OnChainService {
  private async sendTransaction() {

  }

  async queryTransaction(transactionHash: string)
    : Promise<OnChainTransactionStatus> {
    try {
      Logger.log("value:" + transactionHash)
      const result = await web3.eth.getTransactionReceipt(transactionHash);
      const status = new OnChainTransactionStatus();
      if (!result) {
        status.isGood = false;
        return status;
      }
      status.isGood = result.status === true;
      status.blockNumber = result.blockNumber;
      return status
    } catch (error) {
      throw new Error(error);
    }
  }

  async getBlockNumber(): Promise<number> {
    try {
      const result = await web3.eth.getBlockNumber();
      return result;
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOwnerByNftId(nftId: number): Promise<string> {
    try {
      const nftIdBn = toBN(nftId);
      // const result = await mintAnimalTokenContract.methods.ownerOf(nftId).call();
      const result = await mintAnimalTokenContract.methods.ownerOf(nftIdBn).call();
      return result;
    } catch (error) {
      throw new Error(error)
    }
  }

  async sendNft(toAccount: string, nftId: number): Promise<TransactionReceipt> {

    const nftIdBn = toBN(nftId);

    const tx = await mintAnimalTokenContract.methods.safeTransferFrom({
      from: changgo_address,
      to: toAccount,
      tokenId: nftIdBn
    })

    const account = web3.eth.accounts.privateKeyToAccount(changgo_private_key);
    const signedRawTx = account.sign(tx);
    const result = await web3.eth.sendSignedTransaction(signedRawTx.rawTransaction);
    return result;
    // TODO: add error handling and logger
    // TODO: wrap error messages since credentials could be exposed



  }

  // send gold to wallet
}