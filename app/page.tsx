import Image from 'next/image';
import styles from './page.module.css';
import Test from './components/Test';

export default function Home() {
  return (
    <main className={styles.main}>
      <Test/>
    </main>
  )
}
