'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Icons } from './ui/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { trpc } from '../../../apps/web/app/_trpc/client';

const ACCEPTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp', 'heic'];

type Props = {
  id: string;
  bucket: 'events' | 'artists' | 'venues';
};

export default function UploadImage({ params }: { params: Props }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [imgUrl, setImgUrl] = React.useState('');
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const updateEvent = trpc.updateEvent.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast.error('Error updating event');
        console.error('Error updating event:', error);
        setIsLoading(false);
      } else {
        router.push(`/dashboard/event/${params.id}`);
      }
    },
  });

  const updateArtist = trpc.updateArtist.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast.error('Error updating artist');
        console.error('Error updating artist:', error);
        setIsLoading(false);
      } else {
        router.push(`/artist/${params.id}`);
      }
    },
  });

  const updateVenue = trpc.updateVenue.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast.error('Error updating venue');
        console.error('Error updating venue:', error);
        setIsLoading(false);
      } else {
        router.push(`/venue/${params.id}`);
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
    } else if (params.bucket === 'venues') {
      updateVenue.mutate({
        id: params.id,
        image: url,
      });
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    if (data.file.length == 0) {
      toast.error('Must choose a file to upload');
      setIsLoading(false);
      return;
    }

    const fileType = data.file[0].name.split('.')[1];
    if (!ACCEPTED_IMAGE_TYPES.includes(fileType)) {
      toast.error('Image must be a jpeg, jpg, png, webp, or heic');
      setIsLoading(false);
      return;
    }
    const bucket = params.bucket;
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('fileName', data.file[0].name);
    if (bucket === 'events') {
      formData.append('location', `/${params.id}/event_photo.${fileType}`);
    } else if (bucket === 'artists') {
      formData.append('location', `/${params.id}/profile.${fileType}`);
    } else if (bucket === 'venues') {
      formData.append('location', `/${params.id}/profile.${fileType}`);
    }

    formData.append('bucket', bucket);
    formData.append('id', params.id);

    try {
      toast('Uploading image...');

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(baseUrl + `/api/image/upload`, {
        method: 'POST',
        body: formData,
        cache: 'no-store',
      });

      if (res.ok) {
        toast.success('Image uploaded successfully');
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
          toast.error('Must be signed in to upload an image');
        } else {
          toast.error('Error uploading image');
        }
        console.error('Error uploading image:', error.error);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error('Error uploading image');
      console.error('Error uploading image:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-2 grid-rows-1 gap-8'>
          <Input
            id='picture'
            type='file'
            disabled={isLoading}
            {...register('file', {
              onChange: (e) => {
                setImgUrl(URL.createObjectURL(e.target.files[0]));
              },
            })}
          />
          <Button type='submit' disabled={isLoading} className='max-w-[40%]'>
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            {params.bucket === 'events'
              ? 'Create Event'
              : params.bucket === 'artists'
              ? 'Create Artist'
              : params.bucket === 'venues'
              ? 'Create Venue'
              : ''}
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
              alt='Image'
              width={300}
              height={300}
              className='rounded-lg'
            />
          </div>
        )}
      </div>
    </>
  );
}
