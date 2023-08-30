import React from 'react';
import UploadImage from './UploadImage';
import { Separator } from './ui/separator';

export default function EventCreateImage({ id }: { id: string }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  return (
    <div className=" space-y-6 p-10 pb-16 sm:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Create Event</h2>
        <p className="text-muted-foreground">
          Please fill in all the details to create your event!
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="space-y-6">
          <div>
            <div className="space-y-2">
              <h1 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Upload an Image for the Event
              </h1>
              <UploadImage id={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
