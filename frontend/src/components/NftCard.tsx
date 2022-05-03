import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import axios from 'axios'
import Caver, { Contract } from 'caver-js'
import React, { FC } from 'react'
import { nftAbi, nftAddress,  } from '../web3Config'
import CharacterCard, { ICardProps } from './CharacterCard'

interface NftCardProps extends ICardProps {
    account:string,
    contract?:Contract,
    onClick?:Function,
    setMessage?:Function
 };

const NftCard: FC<NftCardProps> = (props) => {
    const account = props.account;
    const nftId = props.nftId;
    const contract = props.contract;
    const changgoAddress = process.env.REACT_APP_OWNER_ACCOUNT_ADDRESS;
    const onClick = props.onClick;
    const setMessage = props.setMessage;

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

            console.log(account, changgoAddress, nftId)
            const result = await contract.methods
            .safeTransferFrom(
                account, changgoAddress, nftId
            )
            .send({from:account, gas:estimateGas});

            console.log(result)
            console.log(result.transactionHash)

            if (result.transactionHash) {
                const response = await 
                    axios.put( "/api/inventory/" + account + "/items/" + nftId)
                console.log("add item: " + response)

            }


        } catch (error) {
            console.error(error)
        }
    }

    const onClickGanghwa = async () => {
        const result = await axios
        .put(`api/game/ganghwa/${account}/${nftId}`);
        if (result.data) {
            setMessage && setMessage("Success")
        }
        else {
            setMessage && setMessage("Fail")

        }
    }

    return (
        <Box textAlign = "center" w = {150} >
        <CharacterCard nftId={props.nftId} type={props.type} level = {props.level} />
        <Button size="sm" colorScheme="blue" mt={2} onClick={onClickDeposit} display= "inline-block">
                        to Game
                    </Button>
                    <Button size="sm" colorScheme="blue" mt={2} display= "inline-block"
                    onClick = {() => {onClick&&onClick(); onClickGanghwa()}}>
                        +1
                    </Button>
        </Box>
    )
}

export default NftCard