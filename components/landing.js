import styles from '@/styles/landing.module.css';
import Link from 'next/link';

export default function Landing() {
  return (
    <div className={styles.container}>
      <h2 className={styles._heading}>Welcome to our NFT-based Ticketing System!</h2>
      <p className={styles._paragraph}>Experience the future of event ticketing with our cutting-edge platform powered by Non-Fungible Tokens (NFTs). Our revolutionary ticketing system leverages blockchain technology to bring you unparalleled security, authenticity, and ownership over your event tickets.</p>
      <Link href="/buy"><button className={styles._button}>Get Started</button></Link>
    </div>
  );
}
