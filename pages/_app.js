import '@/styles/globals.css'
import { useState } from 'react';

export default function App({ Component, pageProps }) {
  const [metamaskMessage, setMetamaskMessage] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [contractRegistryAddress] = useState("0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6");
  const [marketplaceAddress] = useState("0x8A791620dd6260079BF849Dc5567aDC3F2FdC318");

  return <Component {...pageProps} metamaskMessage={metamaskMessage} setMetamaskMessage={setMetamaskMessage} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} provider={provider} setProvider={setProvider} address={address} setAddress={setAddress} contractRegistryAddress={contractRegistryAddress} marketplaceAddress={marketplaceAddress}/>
}
