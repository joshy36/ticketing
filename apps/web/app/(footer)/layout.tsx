import Footer from '~/components/Footer';

export default function FooterLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
      <div className='pt-28'>
        <Footer />
      </div>
    </section>
  );
}
