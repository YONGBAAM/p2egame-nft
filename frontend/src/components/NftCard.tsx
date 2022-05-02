import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import axios from 'axios'
import Caver, { Contract } from 'caver-js'
import React, { FC } from 'react'
import { nftAbi, nftAddress,  } from '../web3Config'
import CharacterCard, { ICardProps } from './CharacterCard'

interface NftCardProps extends ICardProps {
    account:string,
    contract?:Contract
 };

const NftCard: FC<NftCardProps> = (props) => {
    const account = props.account;
    const id = props.nftId;
    const contract = props.contract;
    const changgoAddress = process.env.REACT_APP_OWNER_ACCOUNT_ADDRESS;

    const onClickDeposit = async () => {
        try {

            // FIrst safe transfer in NFT space
            console.log("to game")
            if (!contract){
                console.log("contract: " + contract)
                return;
            }
            console.log(contract)

            const estimateGas = 
            await contract.methods
            .safeTransferFrom(account, process.env.REACT_APP_OWNER_ACCOUNT_ADDRESS, props.nftId )
            .estimateGas({ from: account,
                gas: 6000000
            })

            console.log(account, changgoAddress, id)
            const result = await contract.methods
            .safeTransferFrom(
                account, changgoAddress, id
            )
            .send({from:account, gas:estimateGas});

            console.log(result)
            console.log(result.transactionHash)

            if (result.transactionHash) {
                const response = await 
                    axios.put( "/inventory/" + account + "/items/" + id)
                console.log("add item: " + response)

            }


        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Box textAlign = "center" w = {150} >
        <CharacterCard nftId={props.nftId} type={props.type} />
        <Button size="sm" colorScheme="blue" mt={2} onClick={onClickDeposit} display= "inline-block">
                        to Game
                    </Button>
        </Box>
    )
}

export default NftCard