import Link from "next/link";
import { ethers } from "ethers";

export default function Header(props) {

    async function handleConnectWallet() {
        if(typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                props.setProvider(web3Provider);
                const signer = web3Provider.getSigner();
                props.setAddress((await signer).getAddress());

                window.ethereum.on('accountsChanged', async () => {
                    if(window.ethereum.selectedAddress) {
                        (await signer).getAddress().then(props.setAddress);
                    } else {
                        props.setIsWalletConnected(false);
                    }
                });

                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                });

                props.setIsWalletConnected(true);
            }catch(err) {
                console.log(err);
            }
        } else {
            props.setMetamaskMessage(true);
        }
    }

    return (
        <>
            {props.metamaskMessage?
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
                    
                    {props.isWalletConnected ? (
                        <div>
                        <li style={{display: 'inline'}}>
                            <a href="/buy-tickets">Buy Tickets</a>
                        </li>
                        <li style={{display: 'inline'}}>
                            <Link href="/create" id="create">
                            Create Events
                            </Link>
                        </li>
                        <li style={{display: 'inline'}}>
                            <a href="/inventory" id="inventory">
                            My Account
                            </a>
                        </li>
                        </div>
                    ) : null}
                    {!props.isWalletConnected?
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