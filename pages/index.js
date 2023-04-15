import Head from 'next/head'
import { useState, useEffect } from 'react'
import Header from '@/components/header';
import { ethers } from 'ethers';

export default function Home({ metamaskMessage, setMetamaskMessage, address, setAddress, provider, setProvider, isWalletConnected, setIsWalletConnected }) {
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

        setIsWalletConnected(true);
    }catch(err) {
        console.log(err);
    }
  }

  useEffect(() => {
    checkWallet();
  }, []);

  return (
    <>
      <Head>
        <title>Zanontickets</title>
        <meta name="description" content="NFT Ticketing System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header metamaskMessage={metamaskMessage} setMetamaskMessage={setMetamaskMessage} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} provider={provider} setProvider={setProvider} address={address} setAddress={setAddress}></Header>
    </>
  )
}
