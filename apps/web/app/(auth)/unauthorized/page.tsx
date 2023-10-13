export default function Unauthorized() {
  return (
    <div className='mt-24 space-y-0.5 text-center'>
      <h1 className='text-4xl font-bold tracking-tight'>Unauthorized</h1>
      <p className='text-muted-foreground'>
        Sorry, you are not authorized to view this page!
      </p>
    </div>
  );
}
