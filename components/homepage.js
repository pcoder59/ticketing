import { ethers } from "ethers";
import NftContract from '../artifacts/contracts/nft.sol/TicketingSystem.json';
import { useEffect, useState } from "react";

export default function HomePage({ deployed, provider }) {
    const [details, setDetails] = useState([]);

    async function getDetails() {
        var detail = [];
        for(const address of deployed) {
            const contract = new ethers.Contract(address, NftContract.abi, provider);
            const eventName = await contract.name();
            const eventDateTime = await contract.datetime();
            const eventLocation = await contract.location();
            const eventDescription = await contract.description();
            var ticketPrice = await contract.ticketPrice();
            ticketPrice = (ticketPrice.toNumber())/1000000000000000000;
            detail.push({ eventName, eventDateTime, eventLocation, eventDescription, ticketPrice });
        }
        setDetails(detail);
    }

    useEffect(() => {
        getDetails();
    }, [details]);

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
                            <form>
                                <button type="submit">Buy Ticket</button>
                            </form>
                        </section>
                    </div>
                );
            })}
        </>
    );
}