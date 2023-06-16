import { useState } from 'react';
import styles from '@/styles/popup.module.css';

export default function Popup({ imageUrl, onClose }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <div className={`${styles.popup} ${isOpen ? styles.open : ''}`}>
      <div className={styles.content}>
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>
        <img className={styles.image} src={imageUrl} alt="NFT Image" />
      </div>
    </div>
  );
}
