import { Grid } from '@chakra-ui/layout';
import React, { FC, useState } from 'react'
import { ICardProps } from '../components/CharacterCard';
import GameCard from '../components/GameCard';

interface gameStorageProps {
    account:string
}

const GameStorage:FC<gameStorageProps> = ({
    account
}) => {

    const [cardArray, setCardArray] = useState<ICardProps[]>([
        {nftId:123, type:33},{nftId:123, type:34},{nftId:133, type:43}
    ]);

  return (
    <>
    <Grid templateColumns="repeat(4, 1fr)" gap={8} mt={4}>
        {cardArray &&
            cardArray.map((v, i) => {
                return (
                    <GameCard
                        key={i}
                        nftId={v.nftId}
                        type={v.type}
                        account={account}
                    />
                );
            })}
    </Grid>
</>
  )
}

export default GameStorage