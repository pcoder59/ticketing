import Head from "next/head";
import Header from "@/components/header";
import Sale from "@/components/sale";
import { useEffect } from "react";
import { ethers } from "ethers";

export default function Marketplace({metamaskMessage, setMetamaskMessage, isWalletConnected, setIsWalletConnected, setProvider, setAddress, provider, marketplaceAddress, address}) {
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
        }catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        checkWallet();
    }, [isWalletConnected]);    

    return (
        <>
            <Head>
                <title>Zanontickets - Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header metamaskMessage={metamaskMessage} setMetamaskMessage={setMetamaskMessage} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} setProvider={setProvider} setAddress={setAddress}></Header>
            <main>
                <h1>NFT Marketplace</h1>
                <h2>NFTs on Sale</h2>
                <Sale provider={provider} marketplaceAddress={marketplaceAddress} address={address}></Sale>
            </main>
        </>
    )
}