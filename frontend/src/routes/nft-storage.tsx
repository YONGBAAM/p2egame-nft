import React, { FC, useEffect, useState } from 'react'
import { ICardProps } from '../components/CharacterCard';
import { mintAnimalTokenContract} from "../web3Config";
import { Flex, Grid } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import NftCard from '../components/NftCard';
import { Contract } from 'caver-js';


interface NftStorageProps {
    account:string;
    contract?:Contract;
}

const NFTStorage:FC<NftStorageProps> = (props) => {
    const [cardArray, setCardArray] = useState<ICardProps[]>([]);
    const account = props.account;
    const contract = props.contract;
    const getAnimalTokens = async () => {
        try {
            const balanceLength = await mintAnimalTokenContract.methods
                .balanceOf(account).call()

            if (balanceLength === "0") return;

            const tempAnimalCardArray: ICardProps[] = [];

            const response:number[] = await mintAnimalTokenContract.methods
                .walletOfOwner(account)
                .call();
            
                console.log(response);
                
            response.map((v: number) => {
                tempAnimalCardArray.push({
                    nftId: v,type:0
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
                        contract={contract}
                    />
                );
            })}
    </Grid>
</>
  )
}

export default NFTStorage