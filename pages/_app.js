import '@/styles/globals.css'
import { useState } from 'react';

export default function App({ Component, pageProps }) {
  const [metamaskMessage, setMetamaskMessage] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [contractRegistryAddress] = useState("0xfCeb3D7290043c0DB9d86C74028d3B92b6FAB750");
  const [marketplaceAddress] = useState("0x629D008b231060995FFC6aA69b9711FC7Ef349Ad");

  return <Component {...pageProps} metamaskMessage={metamaskMessage} setMetamaskMessage={setMetamaskMessage} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} provider={provider} setProvider={setProvider} address={address} setAddress={setAddress} contractRegistryAddress={contractRegistryAddress} marketplaceAddress={marketplaceAddress}/>
}
