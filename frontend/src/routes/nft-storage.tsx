import React, { FC, useEffect, useState } from 'react'
import { ICardProps } from '../components/CharacterCard';
import { mintAnimalTokenContract} from "../web3Config";
import { Flex, Grid } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import NftCard from '../components/NftCard';
import { Contract } from 'caver-js';
import GoldInventory from '../components/GoldInventory';
import axios from 'axios';


interface NftStorageProps {
    account:string;
    contract?:Contract;
}

const NFTStorage:FC<NftStorageProps> = (props) => {
    const [cardArray, setCardArray] = useState<ICardProps[]>([]);
    const [myAllScore, setMyAllScore] = useState<number>(0);
    const [myUsedScore, setMyUsedScore] = useState<number>(0);
    const [displayMessage, setDisplayMessage] = useState<string>("");


    const account = props.account;
    const contract = props.contract;
    const getAnimalTokens = async () => {
        try {
            const balanceLength = await mintAnimalTokenContract.methods
                .balanceOf(account).call()

            if (balanceLength === "0") return;

            const tempAnimalCardArray: ICardProps[] = [];

            const response:number[] = await mintAnimalTokenContract.methods
                .walletOfOwnerV2(account)
                .call();
            
                console.log(response);
            
                
            response.map((v: any) => {
                tempAnimalCardArray.push({
                    nftId: v['id'],type:0,level:v['other']
                });
            });

            setCardArray(tempAnimalCardArray)

        } catch (error) {
            console.error(error)
        }
    }

    const getUsedScore = async () => {
      const usedScoreResp = await axios.get( `/api/game/my-usedscore/${account}`);
      const topScoreResp = await axios.get( `/api/game/my-topscore/${account}`);
      setMyAllScore(topScoreResp.data)
      setMyUsedScore(usedScoreResp.data)
    }

    const onClick = () => {
      getUsedScore();
      getAnimalTokens();
    }

    useEffect(() => {
        if (!account) return;
        getAnimalTokens();
    }, [account]
    );

    useEffect(() => {
      if (!account) return;
      getUsedScore();
  }, [account]
  );

    // TODO: Onclick Refresh page when click +1
    // or pass onclick to button
  return (
    <>
    <GoldInventory ganghwaCost={100} myScore={myAllScore} usedScore={myUsedScore}
      displayMessage= {displayMessage}
    />
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
                        level = {v.level}
                        onClick = {onClick}
                        setMessage = {setDisplayMessage}
                    />
                );
            })}
    </Grid>
</>
  )
}

export default NFTStorage