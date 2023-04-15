import Head from "next/head";
import { useState, useEffect } from "react";
import Header from "@/components/header";
import { ethers } from "ethers";
import NftContract from '../artifacts/contracts/nft.sol/TicketingSystem.json';
import ContractRegistry from '../artifacts/contracts/storage.sol/ContractRegistry.json';

export default function Create(props) {
    async function checkWallet() {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            props.setProvider(web3Provider);
            const signer = web3Provider.getSigner();
            props.setAddress((await signer).getAddress());
    
            window.ethereum.on('accountsChanged', async () => {
                if(window.ethereum.selectedAd1dress) {
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
        location: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);
        // Perform form submission logic here
        const signer = props.provider.getSigner();
        const contractFactory = new ethers.ContractFactory(
            NftContract.abi,
            NftContract.bytecode,
            signer
        );

        const contract = await contractFactory.deploy(formData.name, formData.symbol, (parseFloat(formData.price)*1000000000000000000), formData.count, formData.description, formData.datetime, formData.location);

        await contract.deployed();

        console.log("Contract Deployed at Address: ", contract.address);

        var registryAbi = ContractRegistry.abi;
        const registryAddress = "0xbCF26943C0197d2eE0E5D05c716Be60cc2761508";
        const registry = new ethers.Contract(registryAddress, registryAbi, signer);

        const owner = props.address;
        const deployedAddress = contract.address;
        registry.registerContract(owner, deployedAddress).then((transaction) => {
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
            <Header metamaskMessage={props.metamaskMessage} setMetamaskMessage={props.setMetamaskMessage} isWalletConnected={props.isWalletConnected} setIsWalletConnected={props.setIsWalletConnected} provider={props.provider} setProvider={props.setProvider} address={props.address} setAddress={props.setAddress}></Header>
            <main>
				{
					props.isWalletConnected?
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

                            <button type="submit">Create Event</button>
                        </form>
					</div>:null
				}
		        
	        </main>
        </>
    );
}