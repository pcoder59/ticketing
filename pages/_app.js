import '@/styles/globals.css'
import { useState } from 'react';

export default function App({ Component, pageProps }) {
  const [metamaskMessage, setMetamaskMessage] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [contractRegistryAddress] = useState("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  return <Component {...pageProps} metamaskMessage={metamaskMessage} setMetamaskMessage={setMetamaskMessage} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} provider={provider} setProvider={setProvider} address={address} setAddress={setAddress} contractRegistryAddress={contractRegistryAddress}/>
}
