import Link from "next/link";
import { ethers } from "ethers";

export default function Header({ metamaskMessage, setMetamaskMessage, setAddress, setProvider, isWalletConnected, setIsWalletConnected }) {
    async function handleConnectWallet() {
        if(typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(web3Provider);
                const signer = web3Provider.getSigner();
                setAddress((await signer).getAddress());

                window.ethereum.on('accountsChanged', async () => {
                    if(window.ethereum.selectedAddress) {
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
        } else {
            setMetamaskMessage(true);
        }
    }

    return (
        <>
            {metamaskMessage?
                <div id="metamask-message">
                <p>
                    Metamask is not installed or not logged in. Please{" "}
                    <a href="https://metamask.io/" target="_blank" style={{ color: "blue" }}>
                    install Metamask
                    </a>{" "}
                    to use this website.
                </p>
                </div>:
                null 
            }
            <header>
                <h1>NFT Ticketing System</h1>
                <nav>
                    <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    
                    {isWalletConnected ? (
                        <div>
                        <li style={{display: 'inline'}}>
                            <Link href="/buy" id="buy">
                            Buy
                            </Link>
                        </li>
                        <li style={{display: 'inline'}}>
                            <Link href="/create" id="create">
                            Create Events
                            </Link>
                        </li>
                        <li style={{display: 'inline'}}>
                            <Link href="/myticks" id="myticks">
                            My Account
                            </Link>
                        </li>
                        <li style={{display: 'inline'}}>
                            <Link href="/marketplace" id="marketplace">
                                Marketplace
                            </Link>
                        </li>
                        </div>
                    ) : null}
                    {!isWalletConnected?
                        <li>
                            <a href="#" id="connect" onClick={handleConnectWallet}>
                            Connect Wallet
                            </a>
                        </li>
                        :
                        <li>
                            <a href="#" id="disconnect">
                            Disconnect Wallet
                            </a>
                        </li>
                    }
                    </ul>
                </nav>
            </header>
        </>
    )
}