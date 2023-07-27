// import Image from 'next/image';
import styles from '../../app/page.module.css';
import Events from '../../app/components/Events';
import EventsBetter from '../../app/components/EventsBetter';
import Header from '../../app/components/Header';

import '../../app/globals.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <Events />
      <EventsBetter />
    </main>
  );
}
