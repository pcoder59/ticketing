import Head from "next/head";
import Header from "@/components/header";
import Events from "@/components/events";
import Inventory from "@/components/inventory";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ContractRegistry from '../artifacts/contracts/storage.sol/ContractRegistry.json';

export default function MyTicks({ metamaskMessage, setMetamaskMessage, isWalletConnected, setIsWalletConnected, setProvider, setAddress, provider, address, contractRegistryAddress }) {
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
              for(const owner of owners) {
                const deployedContracts = await contractRegistry.getDeployedContracts(owner);
                const contracts = [];
                for(const contract of deployedContracts) {
                  contracts.push(contract);
                }
                setDeployed(contracts);
              }
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
                <title>Zanontickets - My Events</title>
                <meta name="description" content="View your events" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header metamaskMessage={metamaskMessage} setMetamaskMessage={setMetamaskMessage} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} setProvider={setProvider} setAddress={setAddress}></Header>
            <main>
                <h1>View Events and Tickets</h1>
                <h2>Created Events</h2>
                <Events deployed={deployed} provider={provider} address={address}></Events>
                <h2>Owned Tickets</h2>
                <Inventory deployed={deployed} provider={provider} address={address}></Inventory>
            </main>
        </>
    )
}