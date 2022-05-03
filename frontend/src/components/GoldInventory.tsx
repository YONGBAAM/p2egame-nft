import React, { FC } from 'react'

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
    <div>{`+1=${ganghwaCost} ${usedScore}/${myScore} ${displayMessage}`}</div>
  )
}

export default GoldInventory