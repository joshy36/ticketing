'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';
import { Icons } from './ui/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';

const ACCEPTED_IMAGE_TYPES = ['jpeg'];

type Props = {
  id: string;
  bucket: 'events' | 'artists';
};

export default function UploadImage({ params }: { params: Props }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [imgUrl, setImgUrl] = React.useState('');
  const { register, handleSubmit } = useForm();
  const { toast } = useToast();
  const router = useRouter();

  const updateEvent = trpc.updateEvent.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast({
          description: 'Error updating event',
        });
        console.error('Error updating event:', error);
        setIsLoading(false);
      } else {
        router.push(`/event/${params.id}`);
      }
    },
  });

  const updateArtist = trpc.updateArtist.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast({
          description: 'Error updating artist',
        });
        console.error('Error updating artist:', error);
        setIsLoading(false);
      } else {
        router.push(`/artist/${params.id}`);
      }
    },
  });

  const updateImage = async (url: string) => {
    if (params.bucket === 'events') {
      updateEvent.mutate({
        id: params.id,
        image: url,
      });
    } else if (params.bucket === 'artists') {
      updateArtist.mutate({
        id: params.id,
        image: url,
      });
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
    const bucket = params.bucket;
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('fileName', data.file[0].name);
    if (bucket === 'events') {
      formData.append('location', `/${params.id}/event_photo.jpeg`);
    } else if (bucket === 'artists') {
      formData.append('location', `/${params.id}/profile.jpeg`);
    }

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
        const url =
          process.env.NEXT_PUBLIC_BUCKET_BASE_URL +
          '/' +
          bucket +
          fileName.location;
        await updateImage(url);
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
            {...register('file', {
              onChange: (e) => {
                setImgUrl(URL.createObjectURL(e.target.files[0]));
              },
            })}
          />
          <Button type="submit" disabled={isLoading} className="max-w-[40%]">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {params.bucket === 'events' ? 'Create event' : 'Create Artist'}
          </Button>
        </div>
      </form>
      <br></br>
      <div>
        {imgUrl === '' ? (
          <div></div>
        ) : (
          <div>
            <Image
              src={imgUrl}
              alt="Image"
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        )}
      </div>
    </>
  );
}
