export default function Unauthorized() {
  return (
    <div className="space-y-0.5 text-center mt-24">
      <h1 className="text-4xl font-bold tracking-tight">Unauthorized</h1>
      <p className="text-muted-foreground">
        Sorry, you are not authorized to view this page!
      </p>
    </div>
  );
}
