import Head from "next/head";
import { useState, useEffect } from "react";
import Header from "@/components/header";
import { ethers } from "ethers";
import NftContract from '../artifacts/contracts/nft.sol/TicketingSystem.json';
import ContractRegistry from '../artifacts/contracts/storage.sol/ContractRegistry.json';

export default function Create({ metamaskMessage, setMetamaskMessage, address, setAddress, provider, setProvider, isWalletConnected, setIsWalletConnected, contractRegistryAddress }) {
    const [contractAddress, setContractAddress] = useState(null);

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
        const signer = provider.getSigner();
        const contractFactory = new ethers.ContractFactory(
            NftContract.abi,
            NftContract.bytecode,
            signer
        );

        const amount = ethers.utils.parseEther(formData.price);
        const contract = await contractFactory.deploy(formData.name, formData.symbol, amount, formData.count, formData.description, formData.datetime, formData.location);

        await contract.deployed();

        console.log("Contract Deployed at Address: ", contract.address);
        setContractAddress(contract.address);

        var registryAbi = ContractRegistry.abi;
        const registryAddress = contractRegistryAddress;
        const registry = new ethers.Contract(registryAddress, registryAbi, signer);

        const owner = address;
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

                            <button type="submit">Create Event</button>
                        </form>
                        {contractAddress? <h2>Contract Deployed at address: {contractAddress}</h2> : null}
					</div>:null
				}
		        
	        </main>
        </>
    );
}