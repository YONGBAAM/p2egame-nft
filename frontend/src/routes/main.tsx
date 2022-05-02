import { Button } from '@chakra-ui/button';
import { Box, Flex, Text } from '@chakra-ui/layout';
import Caver, { Contract } from 'caver-js';
import React, { FC, useState } from 'react'
import { mintAnimalTokenContract , nftAbi, nftAddress} from '../web3Config';

interface mainProps {
    account: string;
    contract?:Contract;
}

const Main: FC<mainProps> = (props) => {
    const [txidMessage, setTxidMessage] = useState<string>("")
    const [displayMessage, setDisplayMessage] = useState<string>("Let's mint token")
    const account = props.account;
    var contract = props.contract;

    // TODO: What function type?
    const onClickMint = async (setTxidMessage:any, setDisplayMessage:any) => {

        try {
            if (!account) console.error("err")
            console.log(account);
            if (!contract) return;

            // NOTE:::: THIS VALUE NEED TO BE SET! with payable!!
            const estimateGas = await contract.methods.mint(1)
            .estimateGas({ from: account,
                gas: 6000000,
                value: "0x16345785d8a0000"
            })
            console.log(estimateGas)
            await contract.methods.mint(1).send({from:account, gas:estimateGas, value:"0x16345785d8a0000"});



            // const cont = caver.contract.create(nftAbi, nftAddress, {from:account, gas:"0x70791"})
            // const tx = cont.methods.mint(1);
            // tx.from = account;
            // const klaytn = window.klaytn;
            // // console.log(tx)
            // // window.klaytn.sendAsync(tx)
            
            // const transactionParameters = {
            //     to: nftAddress,
            //     from: account,
            //     data: "0xa0712d680000000000000000000000000000000000000000000000000000000000000002",
            //     value: "0x16345785D8A0000",
            //     gas:"0x70791"

            //   };
            
            //   // 하고 싶은 일 블록체인에 요청하기
            //   klaytn.sendAsync(
            //     {
            //       method: "klay_sendTransaction",
            //       params: [transactionParameters, "latest"],
            //       from: account
            //     },
            //     (receipt:any, result:any) => {
            //       console.log(receipt);
            //       console.log(result.result);
            //     setTxidMessage(result.result)
            //     // const response:number[] = await mintAnimalTokenContract.methods
            //     // .walletOfOwner(account)
            //     // .call();
            //     // setDisplayMessage(`ID: ${response[response.length-1]}, Your NFT Count: ${response.length}`)

            //     }
            //   );
            

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
