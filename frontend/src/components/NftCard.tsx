import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import React, { FC } from 'react'
import CharacterCard, { ICardProps } from './CharacterCard'

interface NftCardProps extends ICardProps {
    account:string
 };

const NftCard: FC<NftCardProps> = (props) => {

    const onClickDeposit = () => {

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