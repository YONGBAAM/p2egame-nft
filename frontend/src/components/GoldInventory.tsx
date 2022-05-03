import React, { FC } from 'react'
import {Text} from "@chakra-ui/react"
interface GoldInventoryProps {
  ganghwaCost:number;
  
  usedScore:number;
  myScore:number;
  displayMessage?:string;
}

const GoldInventory:FC<GoldInventoryProps> = (props:GoldInventoryProps) => {
  const ganghwaCost = props.ganghwaCost;
  const usedScore = props.usedScore;
  const myScore = props.myScore;
  const displayMessage = props.displayMessage? props.displayMessage : "";
  return (
    <Text>{`Cost=${ganghwaCost} Used ${usedScore}/${myScore} ${displayMessage}`}</Text>
  )
}

export default GoldInventory