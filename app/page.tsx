import Image from 'next/image';
import styles from './page.module.css';
import Events from './components/Events';

export default function Home() {
  return (
    <main className={styles.main}>
      <Events />
    </main>
  );
}
