import '@/styles/globals.css'
import { useState } from 'react';

export default function App({ Component, pageProps }) {
  const [metamaskMessage, setMetamaskMessage] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [contractRegistryAddress] = useState("0x1275D096B9DBf2347bD2a131Fb6BDaB0B4882487");

  return <Component {...pageProps} metamaskMessage={metamaskMessage} setMetamaskMessage={setMetamaskMessage} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} provider={provider} setProvider={setProvider} address={address} setAddress={setAddress} contractRegistryAddress={contractRegistryAddress}/>
}
