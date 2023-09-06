'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';
import { Icons } from './ui/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ACCEPTED_IMAGE_TYPES = ['jpeg'];

export default function EventUploadImage({
  id,
  buttonText,
}: {
  id: string;
  buttonText: string;
}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = React.useState<boolean>(false);
  const [imgUrl, setImgUrl] = React.useState('');
  const { register, handleSubmit } = useForm();
  const { toast } = useToast();
  const router = useRouter();

  const createEvent = async () => {
    setIsLoading(true);
    const eventUpdate = JSON.stringify({
      image: imgUrl,
    });

    try {
      // make this a trpc thing
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(baseUrl + `/api/event/update/${id}`, {
        method: 'PATCH',
        body: eventUpdate,
        cache: 'no-store',
      });

      if (!res.ok) {
        toast({
          description: 'Error creating event',
        });
        setIsLoading(false);
        throw new Error('Failed to create event');
      } else {
        router.refresh();
        router.push(`/event/${id}`);
      }
    } catch (error) {
      toast({
        description: 'Error creating event',
      });
      console.error('Error creating event:', error);
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    if (data.file.length == 0) {
      toast({
        variant: 'destructive',
        description: 'Must choose a file to upload!',
      });
      setIsLoading(false);
      return;
    }

    const fileType = data.file[0].name.split('.')[1];
    if (!ACCEPTED_IMAGE_TYPES.includes(fileType)) {
      toast({
        variant: 'destructive',
        description: 'Image must be a jpeg',
      });
      setIsLoading(false);
      return;
    }
    const bucket = 'events';
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('fileName', data.file[0].name);
    formData.append('location', `/${id}/event_photo.jpeg`);
    formData.append('bucket', bucket);

    try {
      toast({
        description: 'Uploading image...',
      });
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(baseUrl + `/api/image/upload`, {
        method: 'POST',
        body: formData,
        cache: 'no-store',
      });

      if (res.ok) {
        toast({
          description: 'Image uploaded successfully!',
        });
        const fileName = await res.json();
        setImgUrl(
          process.env.NEXT_PUBLIC_BUCKET_BASE_URL +
            '/' +
            bucket +
            fileName.location
        );
        setIsSuccessful(true);
      } else {
        const error = await res.json();
        if (error.error.message == 'invalid signature') {
          toast({
            variant: 'destructive',
            description: 'Must be signed in to upload an image!',
          });
        } else {
          toast({
            variant: 'destructive',
            description: 'Error uploading image!',
          });
        }
        console.error('Error uploading image:', error.error);
      }
      setIsLoading(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Error uploading image!',
      });
      console.error('Error uploading image:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 grid-rows-1 gap-8">
          <Input
            id="picture"
            type="file"
            disabled={isLoading}
            {...register('file')}
          />
          <Button type="submit" disabled={isLoading} className="max-w-[40%]">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Upload Image
          </Button>
        </div>
      </form>
      <br></br>
      {isSuccessful ? (
        <div>
          <Image
            src={imgUrl}
            alt="Event Image"
            width={300}
            height={300}
            // className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
      ) : (
        <div></div>
      )}
      <Button disabled={isLoading || imgUrl == ''} onClick={createEvent}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        {buttonText}
      </Button>
    </>
  );
}
