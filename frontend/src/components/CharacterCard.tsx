import { Box, Text } from '@chakra-ui/layout'
import React, { FC } from 'react'
import { Button, Image } from "@chakra-ui/react"

export interface ICardProps {
    nftId: number
    type: number
}
const CharacterCard: FC<ICardProps> = ({
    nftId, type
}) => {
    return (
        <Box>
            <Image w={150} h={150} src={`${process.env.PUBLIC_URL}/images/${nftId}.png`} alt="animalImage" />
            <Box flexDirection="row"> 
            <Button size = 'sm' onClick = {() =>{
                window.open("http://www.opensea.com")
            }}>{`id: ${nftId}`}</Button>

            </Box>

        </Box>
    )
}

export default CharacterCard