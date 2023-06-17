import { BigNumber, ethers } from "ethers";
import NftContract from '../artifacts/contracts/nft.sol/TicketingSystem.json';
import { useEffect, useState } from "react";
import { readFileFromIPFS } from "@/pages/api/ipfsImage";
import styles from "@/styles/homepage.module.css";

export default function HomePage({ deployed, provider, address }) {
    const [details, setDetails] = useState([]);

    async function getDetails() {
        var detail = [];
        for(const ownerAddress of deployed) {
            const contractAddress = ownerAddress;
            const contract = new ethers.Contract(ownerAddress, NftContract.abi, provider);
            const cid = await contract.baseURI();
            const fetchurl = cid;
            const fileContent = await readFileFromIPFS(fetchurl);
            const imageUrl = URL.createObjectURL(fileContent);
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
            detail.push({ eventName, eventDateTime, eventLocation, eventDescription, ticketPrice, contractAddress, isactive, totaltickets, remaining, imageUrl });
        }
        console.log(detail);
        setDetails(detail);
    }

    useEffect(() => {
        getDetails();
    }, [deployed]);

    async function handleSubmit(event, contractAddress, ticketPrice) {
        event.preventDefault();
        console.log(contractAddress);
        const nftabi = NftContract.abi;
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, nftabi, signer);
        const value = ethers.utils.parseEther(ticketPrice.toString());
        contract.buyTicket({value: value}).then((transaction) => {
            console.log("Bought ", transaction);
        }).catch((error) => {
            console.log("Error ", error);
        });
    }

    return (
        <>
          {details.map(function (detail, index) {
            return (
              <div key={index} className={styles.eventContainer}>
                <section id="event-details" className={styles.eventDetails}>
                  <h2>Event Details</h2>
                  <img src={detail.imageUrl} className={styles.eventImage} alt="ticket image" />
                  <p><strong>Event Name:</strong> {detail.eventName}</p>
                  <p><strong>Date and Time:</strong> {detail.eventDateTime}</p>
                  <p><strong>Venue:</strong> {detail.eventLocation}</p>
                  <p><strong>Description:</strong> {detail.eventDescription}</p>
                  <p><strong>Ticket Price:</strong> {detail.ticketPrice} ETH</p>
                  <p><strong>Tickets Left: </strong> {detail.remaining} / {detail.totaltickets}</p>
                </section>
                <section id="buy-ticket" className={styles.buyTicket}>
                  <form onSubmit={(event) => handleSubmit(event, detail.contractAddress, detail.ticketPrice)}>
                    {detail.isactive ?
                      <button type="submit" className={styles.buyButton}>Buy Ticket</button>
                      :
                      <button type="submit" className={styles.soldOutButton} disabled>Sold Out</button>
                    }
                  </form>
                </section>
              </div>
            );
          })}
        </>
    );
}