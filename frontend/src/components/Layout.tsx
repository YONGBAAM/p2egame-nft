import React, { FC, useEffect, useState } from "react";
import { Stack, Flex, Box, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {Link as ChakraLink} from "@chakra-ui/react"
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
            alert("Get KaiKas!");
            return;
        }

        const accounts = await window.klaytn.enable();
        console.log("account:" + accounts[0])
        onConnected(accounts[0]);
        const caver = new Caver(window.klaytn);
        const myc = new caver.klay.Contract(nftAbi, nftAddress);
        setContract(myc)
        console.log(myc)

    }

    // const updateSession = async () => {
    //     localStorage.setItem("phaser_game_account", account)
    //     const ss = localStorage.getItem("phaser_game_account")
    //     console.log("session: " + ss)
    // }

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
    };

    useEffect(() => {
        window.klaytn.on('accountsChanged', function() {
    	// kaikas에서 계정을 변경할 때 마다 내부의 함수가 실행됩니다.
    	console.log("Account changed");
        checkConnected(onConnected);

    })
    }, []);

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
                <ChakraLink href={"http://3.36.13.118:3000/"} isExternal>

                    <Button size="sm" colorScheme="blue">
                        GAME
                    </Button>
                </ChakraLink>
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