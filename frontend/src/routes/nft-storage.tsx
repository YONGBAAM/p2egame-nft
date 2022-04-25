import React, { FC, useEffect, useState } from 'react'
import { ICardProps } from '../components/CharacterCard';
import { mintAnimalTokenContract} from "../web3Config";
import { Flex, Grid } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import NftCard from '../components/NftCard';


interface NftStorageProps {
    account:string
}

interface tempAnimalNFTProps {
    animalTokenId:number;
    animalType:number;
}

const NFTStorage:FC<NftStorageProps> = ({account}) => {
    const [cardArray, setCardArray] = useState<ICardProps[]>([]);

    const getAnimalTokens = async () => {
        try {
            const balanceLength = await mintAnimalTokenContract.methods
                .balanceOf(account).call()

            if (balanceLength === "0") return;

            const tempAnimalCardArray: ICardProps[] = [];

            const response = await mintAnimalTokenContract.methods
                .getAnimalTokens(account)
                .call();
            
                console.log(response);
            response.map((v: tempAnimalNFTProps) => {
                tempAnimalCardArray.push({
                    nftId: v.animalTokenId,
                    type:v.animalType,
                });
            });

            setCardArray(tempAnimalCardArray)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (!account) return;
        getAnimalTokens();
    }, [account]
    );

  return (
    <>
    <Grid templateColumns="repeat(4, 1fr)" gap={8} mt={4}>
        {cardArray &&
            cardArray.map((v, i) => {
                return (
                    <NftCard
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

export default NFTStorage