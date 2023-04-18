import { ethers } from "ethers";
import NftContract from '../artifacts/contracts/nft.sol/TicketingSystem.json';
import { useEffect, useState } from "react";

export default function HomePage({ deployed, provider, address }) {
    const [details, setDetails] = useState([]);

    async function getDetails() {
        var detail = [];
        for(const ownerAddress of deployed) {
            const contractAddress = ownerAddress;
            const contract = new ethers.Contract(ownerAddress, NftContract.abi, provider);
            const eventName = await contract.name();
            const eventDateTime = await contract.datetime();
            const eventLocation = await contract.location();
            const eventDescription = await contract.description();
            const organizer = await contract.organizer();
            var ticketPrice = await contract.ticketPrice();
            ticketPrice = (ticketPrice.toNumber())/1000000000000000000;
            const connectedAddress = await address;
            if(organizer != connectedAddress) {
                detail.push({ eventName, eventDateTime, eventLocation, eventDescription, ticketPrice, contractAddress });
            }
        }
        setDetails(detail);
    }

    useEffect(() => {
        getDetails();
    }, [details]);

    function handleSubmit(event, contractAddress) {
        event.preventDefault();
        console.log(contractAddress);
    }

    return (
        <>
            {details.map(function(detail, index){
                return (
                    <div key={index}>
                        <section id="event-details">
                            <h2>Event Details</h2>
                            <p><strong>Event Name:</strong> {detail.eventName}</p>
                            <p><strong>Date and Time:</strong> {detail.eventDateTime}</p>
                            <p><strong>Venue:</strong> {detail.eventLocation}</p>
                            <p><strong>Description:</strong> {detail.eventDescription}</p>
                            <p><strong>Ticket Price:</strong> {detail.ticketPrice} ETH</p>
                        </section>
                        <section id="buy-ticket">
                            <h2>Buy Ticket</h2>
                            <form onSubmit={(event) => handleSubmit(event, detail.contractAddress)}>
                                <button type="submit">Buy Ticket</button>
                            </form>
                        </section>
                    </div>
                );
            })}
        </>
    );
}