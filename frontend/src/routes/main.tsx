import { Button } from '@chakra-ui/button';
import { Box, Flex, Text } from '@chakra-ui/layout';
import Caver, { Contract,} from 'caver-js';
import React, { FC, useEffect, useState } from 'react'
import {fromWei} from "web3-utils"
import CharacterCard from '../components/CharacterCard';
import { caver, mintAnimalTokenContract , nftAbi, nftAddress} from '../web3Config';

interface mainProps {
    account: string;
    contract?:Contract;
}

const Main: FC<mainProps> = (props) => {
    const [txidMessage, setTxidMessage] = useState<string>("")
    const [costInEther, setCostInEther] = useState<string>("0");
    const [lastMintNftId, setLastMintNftId] = useState<number>(0);

    const account = props.account;
    const  contract = props.contract;

    const getMintValueInBN = async () => {
        try {
            if (contract === undefined) {
                console.error("No contract is injected")
                return;
            }
            const costInBn = await contract.methods.cost().call();
            return costInBn;
        } catch (error) {
            console.error(error);
        }

    }

    const updateCostInEther = async () => {
        try {
            const costInBn = await getMintValueInBN();
            if (costInBn === undefined) {return}
            costInBn && setCostInEther(fromWei(costInBn))
            console.log(fromWei(costInBn))
            // costInBn && setCostInEther(Caver.utils.fromWei(costInBn).toNumber())
    
        } catch (error) {
         console.error(error)   
        }

    }

    useEffect(() => {
        updateCostInEther();
    }, [contract]) // contract가 변할때마다 실행됨

    // TODO: What function type?
    const onClickMint = async (setTxidMessage:any) => {

        try {
            if (!account) console.error("err")
            console.log(account);
            if (!contract) return;
            
            const mintValue = await getMintValueInBN();

            // NOTE:::: THIS VALUE NEED TO BE SET! with payable!!
            const estimateGas = await contract.methods.mint(1)
            .estimateGas({ from: account,
                gas: 6000000,
                value: mintValue
            })
            console.log(estimateGas)
            await contract.methods.mint(1)
            .send({from:account, gas:estimateGas, value:mintValue});

            const wallets = await mintAnimalTokenContract.methods
            .walletOfOwnerV2(account)
            .call();
            
            setLastMintNftId(wallets[wallets.length-1]['id'])

        } catch (error) {
            console.error(error)
        }
    };
    

    return ( // TODO: Add address for query txid
        <Flex w="full" h="100vh"
            justifyContent="center" alignItems="center" direction="column">
            <Text>{`Mint Cost: ${costInEther} Klay`}</Text>
            <Text>{`Please Install Kaikas and login`}</Text>
            <Button mt = {6} mb = {6} size="lg" colorScheme="blue" 
            onClick={() => onClickMint(setTxidMessage)}>
                mint
                </Button>
            <Box alignItems = "center">
                <Text> {txidMessage && "txid: " +  txidMessage}</Text>
                {lastMintNftId !==0? <CharacterCard nftId = {lastMintNftId} type = {0} /> : <Text>Let's mint Card</Text>}
            </Box>
        </Flex>
    )
}

export default Main

function setTxidMessage(txid: any) {
    throw new Error('Function not implemented.');
}
