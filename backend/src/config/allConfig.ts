import { registerAs } from "@nestjs/config";

export default registerAs('all', () => ({
// chainEndpoint: process.env.CHAIN_RPC_ENDPOINT,
// chainContractAddress: process.env.
ownerWalletAccount: process.env.CHAIN_OWNER_ACCOUNT,
ownerWalletKey: process.env.CHAIN_OWNER_KEY,
chainRpcEndpoint: process.env.CHAIN_RPC_ENDPOINT,
contractAddress:process.env.CHAIN_CONTRACT_ADDRESS
}));