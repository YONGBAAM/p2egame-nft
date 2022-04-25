import React, { FC, useEffect, useState } from "react";
import { Stack, Flex, Box, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Account from "./Account";

interface LayoutProps {
    onConnected: Function;
    account: string;
    children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ onConnected, account, children }) => { // size  = " 하면 이렇게 자동완성 나오네

    const connect = async (onConnected: Function) => {
        if (!window.ethereum) {
            alert("Get MetaMask!");
            return;
        }

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        console.log("account:" + accounts[0])
        onConnected(accounts[0]);
    }

    // At first login, check if connected.
    const checkConnected = async (onConnected: Function) => {
        if (!window.ethereum) {
            return;
        }

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        console.log("account:" + accounts[0])
        onConnected(accounts[0]);
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
                    <Text fontWeight="bold">h662-Animals</Text>
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
        </Stack>
    );
};

export default Layout;