import { web3Wrapper } from '../web3Config'
import { OnChainTransactionStatus } from './dto/on-chain-transaction-status.dto';
// import { TransactionReceipt } from 'web3-eth'
import { Inject, Logger, NotImplementedException } from '@nestjs/common';
import { toBN } from 'web3-utils';
import path from 'path';
import * as fs from "fs"
import { ItemMetadata } from 'src/users/dto/item-metadata';
import { ConfigType } from '@nestjs/config';
import allConfig from 'src/config/allConfig';
import { TransactionReceipt } from 'caver-js';
import { time } from 'console';
import { UsersService } from 'src/users/users.service';
import { GameService } from 'src/users/game.service';
// import Web3 from 'web3';

/*
Unlike transaction service, This is adapter to block chain
*/

export class OnChainService {
  constructor(
    @Inject(allConfig.KEY) private config: ConfigType<typeof allConfig>,
  ) {
    Logger.log(config.chainRpcEndpoint)
    Logger.log(config.contractAddress)
    const wr = new web3Wrapper(config.chainRpcEndpoint, config.contractAddress, 
      config.ownerWalletAccount, config.ownerWalletKey);
    this.caver = wr.caver;
    this.contract = wr.nftTokenContract;
    // this.contract.setWallet(this.caver.keyringContainer())
  };
  caver; // TODO: 이거 클래스내부 배리어블 어떻게 하지?
  contract; // web3 contract



  private async sendTransaction() {

  }

  async queryTransaction(transactionHash: string)
    : Promise<OnChainTransactionStatus> {
    try {
      Logger.log("value:" + transactionHash)
      const result = await this.caver.klay.getTransactionReceipt(transactionHash);
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
      const result = await this.caver.klay.getBlockNumber();
      return result;
    } catch (error) {
      throw new Error(error)
    }
  }

  // depredated
  async findOwnerByNftId(nftId: number): Promise<string> {
    try {
      const nftIdBn = toBN(nftId);
      // const result = await mintAnimalTokenContract.methods.ownerOf(nftId).call();
      const result = await this.contract.methods.ownerOf(nftIdBn).call();
      return result;
    } catch (error) {
      throw new Error(error)
    }
  }

  async rawSendNft(toAccount: string, nftId: number): Promise<TransactionReceipt> {
    
    const nftIdBn = toBN(nftId);
    console.log(this.config.ownerWalletAccount)

    const tx = await this.contract.methods.safeTransferFrom(
      this.config.ownerWalletAccount,
      toAccount,
      nftIdBn
    )

    // const result = await this.caver.rpc.klay.sendTransaction(tx);
    // const keyring = this.caver.wallet.keyring.createFromPrivateKey(this.config.ownerWalletKey);
    // const signedTx =       keyring.signMessage(tx, this.caver.wallet.keyring.role)
    // 어 됬네?

    const signedTx = await this.caver.wallet.sign(this.config.ownerWalletAccount, tx);
    console.log(signedTx)
    // this.caver.wallet.sendTransaction()
    const result = await this.caver.rpc.klay.sendRawTransaction(signedTx);
    return result;
    // TODO: add error handling and logger
    // TODO: wrap error messages since credentials could be exposed
  }

  async getLevelOfNft(nftId:number):Promise<number> {

    const nftIdBn = toBN(nftId);
    
    const result = await this.contract.methods.addInfo(
      nftIdBn
    ).call();
    Logger.log(result);
    return result;
  }

  async sendTransactionWithSign(tx:any):Promise<TransactionReceipt> {
    const signedTx = await this.caver.wallet.sign(this.config.ownerWalletAccount, tx);
    console.log(signedTx)
    // this.caver.wallet.sendTransaction()
    const result = await this.caver.rpc.klay.sendRawTransaction(signedTx);
    return result;
  }

  async increaseLevelOfNft(nftId:number, v:number) {

    const nftIdBn = toBN(nftId);
    console.log(this.config.ownerWalletAccount)
    const tx = await this.contract.methods.increaseAddInfo(
      nftIdBn, v
    )
    return this.sendTransactionWithSign(tx)

    // const result = await this.caver.rpc.klay.sendTransaction(tx);
    // const keyring = this.caver.wallet.keyring.createFromPrivateKey(this.config.ownerWalletKey);
    // const signedTx =       keyring.signMessage(tx, this.caver.wallet.keyring.role)
    // 어 됬네?
  }

  // TODO: Unify this two

  // query metadat for NFT by ID
  async queryNftMetaData(nftId: number): Promise<ItemMetadata> {
    const fromOffline = true;
    var rawFile;
    if (fromOffline) {
      try {
        rawFile = fs.readFileSync("src/resources/metadata/" + nftId + ".json", "utf8");
      } catch (error) {
        throw new Error("Cannot Read Metadata of " + nftId)
      }

      const obj: ItemMetadata = JSON.parse(rawFile)
      Logger.log(JSON.stringify(obj));
      return obj
    }
    throw new NotImplementedException();
  }

  

  async queryNftOwner(nftId: number) {
    throw new NotImplementedException();
  }
  // send gold to wallet
}