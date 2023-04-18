import Head from 'next/head'
import { useEffect, useState } from 'react'
import Header from '@/components/header';
import { ethers } from 'ethers';
import ContractRegistry from '../artifacts/contracts/storage.sol/ContractRegistry.json';
import HomePage from '@/components/homepage';

export default function Home({ metamaskMessage, setMetamaskMessage, setAddress, setProvider, isWalletConnected, setIsWalletConnected, provider, contractRegistryAddress, address }) {
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

  return (
    <>
      <Head>
        <title>Zanontickets</title>
        <meta name="description" content="NFT Ticketing System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header metamaskMessage={metamaskMessage} setMetamaskMessage={setMetamaskMessage} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} setProvider={setProvider} setAddress={setAddress}></Header>
      {isWalletConnected?<HomePage deployed={deployed} provider={provider} address={address}></HomePage>:null}
    </>
  )
}
