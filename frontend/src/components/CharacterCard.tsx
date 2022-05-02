import { Box, Text } from '@chakra-ui/layout'
import React, { FC } from 'react'
import { Button, Image } from "@chakra-ui/react"

export interface ICardProps {
    nftId: number;
    type: number;
    lot?:number;
}
const CharacterCard: FC<ICardProps> = (props) => {
    const nftId = props.nftId;
    const type = props.type;
    const lot = props.lot? props.lot:1
    return (
        <Box>
            <Image w={150} h={150} src={`${process.env.PUBLIC_URL}/images/${nftId}.png`} alt="animalImage" />
            <Box flexDirection="row"> 
            <Button size = 'sm' onClick = {() =>{
                window.open("http://www.opensea.com")
            }}>{`#${nftId} X ${lot}`}</Button>

            </Box>

        </Box>
    )
}

export default CharacterCard