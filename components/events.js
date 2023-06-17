import NftContract from '../artifacts/contracts/nft.sol/TicketingSystem.json';
import { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import styles from '@/styles/events.module.css';

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
                detail.push({ eventName, eventDateTime, eventLocation, eventDescription, ticketPrice, contractAddress, isactive, totaltickets, remaining, ticketsold });
            }
        }
        setDetails(detail);
    }

    useEffect(() => {
        getDetails();
    }, [deployed]);

    function handleSubmit(event, contractAddress, ticketPrice) {
        event.preventDefault();
        console.log(contractAddress);
        const nftabi = NftContract.abi;
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, nftabi, signer);
        contract.closeTicketSales().then((transaction) => {
            console.log("Cancelled ", transaction);
        }).catch((error) => {
            console.log("Error ", error);
        });
    }

    return (
        <div className={styles.container}>
          <table className={styles.eventTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="event-table">
              {details.map((detail, index) => {
                return (
                  <tr key={index}>
                    <th>{detail.eventName}</th>
                    <th>{detail.eventDateTime}</th>
                    <th>{detail.eventLocation}</th>
                    <th>{detail.ticketPrice}</th>
                    <th>
                      <form
                        onSubmit={(event) =>
                          handleSubmit(event, detail.contractAddress)
                        }
                      >
                        {detail.isactive ? (
                          <button className={styles.cancelButton} type="submit">
                            Cancel Event
                          </button>
                        ) : (
                          <button className={styles.soldOutButton} type="submit" disabled>
                            Sold Out
                          </button>
                        )}
                      </form>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
    );
}