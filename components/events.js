import NftContract from '../artifacts/contracts/nft.sol/TicketingSystem.json';
import { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';

export default function Events({ deployed, provider, address }) {
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
            const isactive = await contract.isActive();
            var ticketsold = await contract.ticketsSold();
            var totaltickets = await contract.totalTickets();
            ticketsold = ticketsold.toNumber();
            totaltickets = totaltickets.toNumber();
            var remaining = totaltickets - ticketsold;
            var ticketPrice = await contract.ticketPrice();
            var denominator = BigNumber.from('1000000000000000000');
            ticketPrice = ticketPrice.div(denominator);
            ticketPrice = ticketPrice.toString();
            const connectedAddress = await address;
            if(organizer == connectedAddress) {
                detail.push({ eventName, eventDateTime, eventLocation, eventDescription, ticketPrice, contractAddress, isactive, totaltickets, remaining });
            }
        }
        setDetails(detail);
    }

    useEffect(() => {
        getDetails();
    }, [deployed]);

    return (
        <div>
            <table>
            <thead>
                <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Price</th>
                </tr>
            </thead>
            <tbody id="event-table">
                {details.map((detail, index) => {
                    return(
                        <tr key={index}>
                            <th>{detail.eventName}</th>
                            <th>{detail.eventDateTime}</th>
                            <th>{detail.eventLocation}</th>
                            <th>{detail.ticketPrice}</th>
                        </tr>
                    );
                })}
            </tbody>
            </table>
        </div>
    );
}