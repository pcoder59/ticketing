import Head from "next/head";
import Header from "@/components/header";
import HomePage from "@/components/homepage";
import { useEffect, useState } from "react";
import ContractRegistry from '../artifacts/contracts/storage.sol/ContractRegistry.json';
import { ethers } from "ethers";

export default function Buy({metamaskMessage, setMetamaskMessage, isWalletConnected, setIsWalletConnected, setProvider, setAddress, provider, address, contractRegistryAddress}) {
    const [deployed, setDeployed] = useState([]);

    async function checkWallet() {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(web3Provider);
            const signer = web3Provider.getSigner();
            setAddress((await signer).getAddress());

            window.ethereum.on('accountsChanged', async () => {
                if(window.ethereum.selectedAd1dress) {
                    (await signer).getAddress().then(setAddress);
                } else {
                    setIsWalletConnected(false);
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });

            await setIsWalletConnected(true);

            try {
                const contractRegistry = new ethers.Contract(contractRegistryAddress, ContractRegistry.abi, web3Provider);
                const owners = await contractRegistry.getOwners();
                console.log(owners);
                const setups = [];
                for(const owner of owners) {
                    const deployedContracts = await contractRegistry.getDeployedContracts(owner);
                    for(const contract of deployedContracts) {
                        setups.push(contract)
                    }
                }
                setDeployed(setups);
            }catch(err) {
                console.log(err);
            }
        }catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        checkWallet();
    }, [isWalletConnected]);

    return(
        <>
            <Head>
                <title>Zanontickets - Buy Tickets</title>
                <meta name="description" content="NFT Ticketing System" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header metamaskMessage={metamaskMessage} setMetamaskMessage={setMetamaskMessage} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} setProvider={setProvider} setAddress={setAddress}></Header>
            {isWalletConnected?<HomePage deployed={deployed} provider={provider} address={address}></HomePage>:null}
        </>
    );
}