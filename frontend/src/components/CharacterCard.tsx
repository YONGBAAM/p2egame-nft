import { Box, Text } from '@chakra-ui/layout'
import React, { FC } from 'react'

export interface ICardProps {
    nftId: number
    type: number
}
const CharacterCard: FC<ICardProps> = ({
    nftId, type
}) => {
    return (
        <Box>
            <Text>{`id: ${nftId}`}</Text>
            <Text>{`type: ${type}`}</Text>
        </Box>
    )
}

export default CharacterCard