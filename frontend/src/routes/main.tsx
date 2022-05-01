import { Button } from '@chakra-ui/button';
import { Box, Flex, Text } from '@chakra-ui/layout';
import React, { FC, useState } from 'react'
import { mintAnimalTokenContract } from '../web3Config';

interface mainProps {
    account: string;
}

const Main: FC<mainProps> = ({
    account
}) => {
    const [txidMessage, setTxidMessage] = useState<string>("")
    const [displayMessage, setDisplayMessage] = useState<string>("Let's mint token")

    // TODO: What function type?
    const onClickMint = async (setTxidMessage:any, setDisplayMessage:any) => {

        try {
            if (!account) console.error("err")
            const response = await mintAnimalTokenContract.methods.mint(1).send({ from: account})
            const txid = response.transactionHash;
            setTxidMessage(txid);

            if (response.status) {
                // TODO: get last type from contract
                const response:number[] = await mintAnimalTokenContract.methods
                .walletOfOwner(account)
                .call();

                setDisplayMessage(`ID: ${response[response.length-1]}, Your NFT Count: ${response.length}`)

            }

        } catch (error) {
            console.error(error)
        }
    };

    return ( // TODO: Add address for query txid
        <Flex w="full" h="100vh"
            justifyContent="center" alignItems="center" direction="column">
            <Button mt={4} size="sm" colorScheme="blue" onClick={() => onClickMint(setTxidMessage, setDisplayMessage)}>mint</Button>
            <Box alignItems = "center">
                <Text> {txidMessage && "txid: " +  txidMessage}</Text>
                <Text alignItems = "center"> {displayMessage}</Text>
            </Box>
        </Flex>
    )
}

export default Main

function setTxidMessage(txid: any) {
    throw new Error('Function not implemented.');
}
