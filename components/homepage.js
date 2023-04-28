import { BigNumber, ethers } from "ethers";
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
            var denominator = BigNumber.from('1000000000000000000');
            ticketPrice = ticketPrice.div(denominator);
            ticketPrice = ticketPrice.toString();
            const connectedAddress = await address;
            if(organizer != connectedAddress) {
                detail.push({ eventName, eventDateTime, eventLocation, eventDescription, ticketPrice, contractAddress });
            }
        }
        setDetails(detail);
    }

    useEffect(() => {
        if(!details.length) {
            getDetails();
        }
    }, [details]);

    function handleSubmit(event, contractAddress, ticketPrice) {
        event.preventDefault();
        console.log(contractAddress);
        const nftabi = NftContract.abi;
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, nftabi, signer);
        const value = ethers.utils.parseEther(ticketPrice.toString());
        contract.buyTicket({value: value}).then((transaction) => {
            console.log("Bought ", transaction);
            alert("You Buy the Ticket for the event successfully!");
        }).catch((error) => {
            console.log("Error ", error);
        });
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
                            <form onSubmit={(event) => handleSubmit(event, detail.contractAddress, detail.ticketPrice)}>
                                <button type="submit">Buy Ticket</button>
                            </form>
                        </section>
                    </div>
                );
            })}
        </>
    );
}