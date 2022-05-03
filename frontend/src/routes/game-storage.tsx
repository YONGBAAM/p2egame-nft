import { Grid } from '@chakra-ui/layout';
import { Icon } from '@chakra-ui/react';
import axios from 'axios';
import React, { FC, useEffect, useState } from 'react'
import { ICardProps } from '../components/CharacterCard';
import GameCard from '../components/GameCard';

interface gameStorageProps {
    account:string
}

// interface apiInventory {
//     gold:number;
//     item:iitem[];
// }

interface iitem {
    lot:number;
    nft_id:number;
    attributes:string;
}
const GameStorage:FC<gameStorageProps> = ({
    account
}) => {

    const apiEndpoint = process.env.REACT_APP_API_HOST;

    const [cardArray, setCardArray] = useState<ICardProps[]>([
        {nftId:500, type:33, lot:0}
    ]);

    const getItemList =  async () => {
        try {
            const response = await axios.get( "/api/inventory/" + account)
            const tt: ICardProps[] = [];
            console.log(response)
            response.data['items'].map((v: iitem) => {
                tt.push({nftId:v.nft_id, type:0, lot:v.lot})
            })
            setCardArray(tt)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect( () => {
        getItemList()
    }, []

    );

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
                        lot = {v.lot}
                    />
                );
            })}
    </Grid>
</>
  )
}

export default GameStorage