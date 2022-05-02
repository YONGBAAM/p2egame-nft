import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import axios from 'axios'
import React, { FC, useState } from 'react'
import CharacterCard, { ICardProps } from './CharacterCard'

interface GameCardProps extends ICardProps {
    account: string
};

const NftCard: FC<GameCardProps> = (props) => {
    const [activated, setActivated] = useState<boolean>(true);

    const account = props.account;
    const nftId = props.nftId;
    const onClickRetrieval = async () => {
        setActivated(false)
        const result = await axios
        .post( "/transactions/on-chain/nft", {"toAccount":account, "nftId":nftId});
        console.log(result);   
        if (result.data.transactionHash) {
            
        }
        
        const result2 = await axios.delete("inventory/" + account + "/items/" + nftId)
        console.log(result2)
        
    }

    return (
        <Box textAlign="center" w={150} >
            <CharacterCard nftId={props.nftId} type={props.type} lot = {props.lot}/>
            <Button disabled={!activated} size="sm" colorScheme="blue" mt={2} onClick={onClickRetrieval} display="inline-block">
                to NFT
            </Button>
        </Box>
    )
}

export default NftCard