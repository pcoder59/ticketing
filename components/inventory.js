import NftContract from '../artifacts/contracts/nft.sol/TicketingSystem.json';
import MarketplaceContract from '../artifacts/contracts/marketplace.sol/NFTMarketplace.json';
import { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import styles from '@/styles/inventory.module.css';
import Popup from './subcomponent/popup';
import { readFileFromIPFS } from '@/pages/api/ipfsImage';

export default function Inventory({ deployed, provider, address, marketplaceAddress }) {
    const [details, setDetails] = useState([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);

    const handleImageClick = (imageUrl) => {
        console.log(imageUrl);
        setSelectedImageUrl(imageUrl);
    };

    const closePopup = () => {
        setSelectedImageUrl(null);
    };

    const [formData, setFormData] = useState({
      price: ''
    });
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    };
  
    async function getDetails() {
      var detail = [];
      for (const ownerAddress of deployed) {
        const contractAddress = ownerAddress;
        const contract = new ethers.Contract(ownerAddress, NftContract.abi, provider);
        const marketplace = new ethers.Contract(marketplaceAddress, MarketplaceContract.abi, provider);
        const cid = await contract.baseURI();
        const fetchurl = cid + "/ticketimage.png";
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
        const connectedAddress = await address;
        var balance = await contract.balanceOf(connectedAddress);
        balance = balance.toNumber();
        const ticketids = await contract.getTicketIdsByOwner(connectedAddress);
        for (let i = 0; i < ticketids.length; i++) {
          var ticketid = ticketids[i].toNumber();
          const forsale = await marketplace.isNFTListed(contractAddress, ticketid);
          console.log(forsale);
          detail.push({
            eventName,
            eventDateTime,
            eventLocation,
            eventDescription,
            ticketPrice,
            contractAddress,
            isactive,
            totaltickets,
            remaining,
            balance,
            ticketid,
            forsale,
            imageUrl
          });
        }
      }
      setDetails(detail);
    }
  
    useEffect(() => {
      getDetails();
    }, [deployed]);
  
    async function handleSubmit(event, contractAddress, price, ticketid, title) {
      event.preventDefault();
      const signer = provider.getSigner();
      const marketplace = new ethers.Contract(marketplaceAddress, MarketplaceContract.abi, signer);
      const value = ethers.utils.parseEther(price);
      var nftAbi = NftContract.abi;
      const nftAddress = contractAddress;
      const deployedContract = new ethers.Contract(nftAddress, nftAbi, signer);
      await deployedContract.setApprovalForAll(marketplaceAddress, true);
      await marketplace.listNFT(contractAddress, ticketid, value, title);
    }
  
    async function handleCancel(event, contractAddress, ticketid) {
      event.preventDefault();
      const signer = provider.getSigner();
      const marketplace = new ethers.Contract(marketplaceAddress, MarketplaceContract.abi, signer);
      var listingid = await marketplace.getListingId(contractAddress, ticketid);
      marketplace.cancelListing(listingid.toNumber());
    }
  
    return (
      <div>
        <table className={styles.ticketTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Ticket ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail, index) => (
              <tr key={index}>
                <td>
                  <button className={styles.imageButton}
                  onClick={() => handleImageClick(detail.imageUrl)}
                  >
                    <img src="/img/popicon.png" alt="view nft image" width="5%" /> {detail.eventName}
                  </button>
                </td>
                <td>{detail.eventDateTime}</td>
                <td>{detail.eventLocation}</td>
                <td>{detail.ticketid}</td>
                <td>
                  {detail.forsale ? (
                    <form onSubmit={(event) => handleCancel(event, detail.contractAddress, detail.ticketid)}>
                      <div>
                        <button type="submit">Cancel Sale</button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={(event) => handleSubmit(event, detail.contractAddress, formData.price, detail.ticketid, detail.eventName)}>
                      <div>
                        <input
                          type="number"
                          step="0.001"
                          value={formData.price}
                          placeholder="Enter Price"
                          onChange={handleChange}
                          name="price"
                        />
                        <button type="submit">Sell Ticket</button>
                      </div>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedImageUrl && (
            <Popup imageUrl={selectedImageUrl} onClose={closePopup} />
        )}
      </div>
    );
  }