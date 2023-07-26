// import Image from 'next/image';
import styles from './page.module.css';
import Events from './components/Events';
import './globals.css';
import Header from './components/Header';

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <Events />
    </main>
  );
}
