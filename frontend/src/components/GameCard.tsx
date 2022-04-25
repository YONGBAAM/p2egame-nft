import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import React, { FC } from 'react'
import CharacterCard, { ICardProps } from './CharacterCard'

interface GameCardProps extends ICardProps {
    account: string
};

const NftCard: FC<GameCardProps> = (props) => {

    const onClickRetrieval = () => {

    }

    return (
        <Box textAlign="center" w={150} >
            <CharacterCard nftId={props.nftId} type={props.type} />
            <Button size="sm" colorScheme="blue" mt={2} onClick={onClickRetrieval} display="inline-block">
                to NFT
            </Button>
        </Box>
    )
}

export default NftCard