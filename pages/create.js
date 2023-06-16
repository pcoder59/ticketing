import Head from "next/head";
import { useState, useEffect } from "react";
import Header from "@/components/header";
import { ethers } from "ethers";
import NftContract from '../artifacts/contracts/nft.sol/TicketingSystem.json';
import ContractRegistry from '../artifacts/contracts/storage.sol/ContractRegistry.json';

export default function Create({ metamaskMessage, setMetamaskMessage, address, setAddress, provider, setProvider, isWalletConnected, setIsWalletConnected, contractRegistryAddress, marketplaceAddress }) {
    const [contractAddress, setContractAddress] = useState(null);

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

    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        price: '',
        count: '',
        description: '',
        datetime: '',
        location: '',
        ipfs: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);
        // Perform form submission logic here
        const signer = provider.getSigner();
        const contractFactory = new ethers.ContractFactory(
            NftContract.abi,
            NftContract.bytecode,
            signer
        );

        const amount = ethers.utils.parseEther(formData.price);
        const value = ethers.utils.parseEther('1');
        const contract = await contractFactory.deploy(formData.name, formData.symbol, amount, formData.count, formData.description, formData.datetime, formData.location, {value: value}, formData.ipfs);

        await contract.deployed();

        console.log("Contract Deployed at Address: ", contract.address);
        setContractAddress(contract.address);

        var registryAbi = ContractRegistry.abi;
        const registryAddress = contractRegistryAddress;
        const registry = new ethers.Contract(registryAddress, registryAbi, signer);

        const owner = address;
        const deployedAddress = contract.address;
        await registry.registerContract(owner, deployedAddress).then((transaction) => {
            console.log("Added ", transaction);
        }).catch((error) => {
            console.log("Error ", error);
        });
    };

    return (
        <>
            <Head>
                <title>Zanontickets - Create Tickets</title>
                <meta name="description" content="Create NFT Tickets" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header metamaskMessage={metamaskMessage} setMetamaskMessage={setMetamaskMessage} isWalletConnected={isWalletConnected} setIsWalletConnected={setIsWalletConnected} setProvider={setProvider} setAddress={setAddress}></Header>
            <main>
				{
					isWalletConnected?
					<div>
						<form id="create-event-form" onSubmit={handleSubmit}>
                            <label htmlFor="event-name">Event Name:</label>
                            <input type="text" id="event-name" value={formData.name} name="name" onChange={handleChange}></input>

                            <label htmlFor="event-symbol">Event Symbol:</label>
                            <input type="text" id="event-symbol" value={formData.symbol} name="symbol" onChange={handleChange}></input>

                            <label htmlFor="event-description">Event Description:</label>
                            <textarea id="event-description" value={formData.description} name="description" onChange={handleChange}></textarea>

                            <label htmlFor="event-date">Event Date and Time:</label>
                            <input type="datetime-local" id="event-date" value={formData.datetime} name="datetime" onChange={handleChange}></input>

                            <label htmlFor="event-location">Event Location:</label>
                            <input type="text" id="event-location" value={formData.location} name="location" onChange={handleChange}></input>

                            <label htmlFor="event-ticket-price">Ticket Price (in ETH):</label>
                            <input type="number" step="0.001" id="event-ticket-price" value={formData.price} name="price" onChange={handleChange}></input>

                            <label htmlFor="event-ticket-count">Number of Tickets:</label>
                            <input type="number" step="1" id="event-ticket-count" value={formData.count} name="count" onChange={handleChange}></input>

                            <label htmlFor="ipfs">IPFS Folder CID:</label>
                            <input type="text" id="ipfs" value={formData.ipfs} name="ipfs" onChange={handleChange}></input>

                            <button type="submit">Create Event</button>
                        </form>
                        {contractAddress? <h2>Contract Deployed at address: {contractAddress}</h2> : null}
					</div>:null
				}
		        
	        </main>
        </>
    );
}