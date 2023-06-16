import { BigNumber, ethers } from 'ethers';
import MarketplaceContract from '../artifacts/contracts/marketplace.sol/NFTMarketplace.json';
import { useEffect, useState } from 'react';

export default function Sale({provider, marketplaceAddress, address}) {
    const [listingsStore, setListingsStore] = useState([]);

    async function getDetails() {
        const details = [];
        try{
            const marketplace = new ethers.Contract(marketplaceAddress, MarketplaceContract.abi, provider);
            var listings = await marketplace.getAllListedNFTs();
            for(let i = 0; i < listings.length; i++) {
                var active = listings[i].active;
                var tokenId = listings[i].tokenId;
                var title = listings[i].title;
                var price = listings[i].price;
                var nftContract = listings[i].nftContract;
                var seller = listings[i].seller.toString();
                var connectedAddress = await address;
                if(active && (seller != connectedAddress)) {
                    details.push({active, tokenId, title, price, nftContract});
                }
            }
            setListingsStore(details);
        }catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getDetails();
    }, [provider]);

    async function handleSubmit(event, tokenId, price, contractAddress) {
        event.preventDefault();
        console.log(tokenId);
        console.log(price);
        console.log(contractAddress);
        const signer = provider.getSigner();
        const marketplace = new ethers.Contract(marketplaceAddress, MarketplaceContract.abi, signer);
        const listingid = await marketplace.getListingId(contractAddress, tokenId);
        const value = ethers.utils.parseEther(price.div(BigNumber.from('1000000000000000000')).toString());
        await marketplace.buyNFT(listingid.toNumber(), {value: value});
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                    <th>View</th>
                    <th>Token ID</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Action</th>
                    </tr>
                </thead>
                {listingsStore.map((detail, index) => {
                    return(
                        <tbody key={index}>
                            <tr>
                                
                                <td>{detail.tokenId.toString()}</td>
                                <td>{detail.title}</td>
                                <td>{detail.price.div(BigNumber.from('1000000000000000000')).toString()}</td>
                                <td>
                                    <form onSubmit={(event) => handleSubmit(event, detail.tokenId, detail.price, detail.nftContract)}>
                                        <div>
                                            <button type="submit">Buy NFT</button>
                                        </div>
                                    </form>
                                </td>
                            </tr>
                        </tbody>
                    );
                })}
            </table>
        </>
    )
}