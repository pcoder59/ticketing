import { useState } from 'react';
import styles from '@/styles/popup.module.css';
import QRCode from 'react-qr-code';

export default function Popup({ imageUrl, onClose, contractAddress, ticketid }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  var value = {
    "contractAddress": contractAddress,
    "ticketid": ticketid
  }
  console.log(value);
  value = JSON.stringify(value);

  return (
    <div className={`${styles.popup} ${isOpen ? styles.open : ''}`}>
      <div className={styles.content}>
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>
        <img className={styles.image} src={imageUrl} alt="NFT Image" />
        <br></br>
        <QRCode value={value}></QRCode>
      </div>
    </div>
  );
}
