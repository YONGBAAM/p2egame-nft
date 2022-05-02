import React, { FC, useEffect, useState } from "react";
import { Stack, Flex, Box, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Account from "./Account";
import Caver from "caver-js";
import { nftAbi, nftAddress } from "../web3Config";

interface LayoutProps {
    onConnected: Function;
    setContract:Function;
    account: string;
    children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ onConnected, setContract, account, children }) => { // size  = " 하면 이렇게 자동완성 나오네

    const connect = async (onConnected: Function) => {
        if (!window.klaytn) {
            alert("Get MetaMask!");
            return;
        }

        const accounts = await window.klaytn.enable();
        console.log("account:" + accounts[0])
        onConnected(accounts[0]);
        const caver = new Caver(window.klaytn);
        const myc = new caver.klay.Contract(nftAbi, nftAddress);
        setContract(myc)
        console.log(myc)

        updateSession()
    }

    const updateSession = async () => {
        localStorage.setItem("phaser_game_account", account)
        const ss = localStorage.getItem("phaser_game_account")
        console.log("session: " + ss)
    }

    // At first login, check if connected.
    const checkConnected = async (onConnected: Function) => {
        if (!window.klaytn) {
            return;
        }

        const accounts = await window.klaytn.enable();

        console.log("account:" + accounts[0])
        onConnected(accounts[0]);
        const caver = new Caver(window.klaytn);
        const myc = new caver.klay.Contract(nftAbi, nftAddress);
        setContract(myc)
        updateSession()
    };

    useEffect(() => {
        checkConnected(onConnected);
    }, []);

    return (
        <Stack h="100vh">
            <Flex
                bg="purple.200"
                p={4}
                justifyContent="space-around"
                alignItems="center"
            >
                <Box>
                    <Text fontWeight="bold">Under The Sea</Text>
                </Box>

                <Link to="/">

                    <Button size="sm" colorScheme="blue">
                        Main
                    </Button>
                </Link>

                <Link to="nft-storage">

                    <Button size="sm" colorScheme="blue">
                        NFT-Storage
                    </Button>
                </Link>

                <Link to="game-storage">

                    <Button size="sm" colorScheme="blue">
                        GAME-Storage
                    </Button>
                </Link>
                <Button size="sm" colorScheme="blue" onClick = {() => {
                
                        window.location.replace('http://localhost:8000')
                }}>
                        GAME3
                    </Button>
                <Button onClick={() => connect(onConnected)}>
                    {account === "" ? ("login") : <Account account={account} />}
                </Button>
            </Flex>
            <Flex
                direction="column"
                h="full"
                justifyContent="center"
                alignItems="center"
            >
                {children}
            </Flex>
        </Stack >
    );
};

export default Layout;