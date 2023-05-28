import '@/styles/globals.css'
import { useState } from 'react';

export default function App({ Component, pageProps }) {
  const [metamaskMessage, setMetamaskMessage] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [contractRegistryAddress] = useState("0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82");
  const [marketplaceAddress] = useState("0x9A676e781A523b5d0C0e43731313A708CB607508");

  return <Component {...pageProps} metamaskMessage={metamaskMessage} setMetamaskMessage={setMetamaskMessage} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} provider={provider} setProvider={setProvider} address={address} setAddress={setAddress} contractRegistryAddress={contractRegistryAddress} marketplaceAddress={marketplaceAddress}/>
}
