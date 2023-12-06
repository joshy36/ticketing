'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { useRouter } from 'next/navigation';
import { trpc } from '../../_trpc/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ACCEPTED_IMAGE_TYPES = ['jpeg'];

export default function UserUploadImage({
  id,
  userImage,
  buttonText,
}: {
  id: string;
  userImage: string | null | undefined;
  buttonText: string;
}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [imgUrl, setImgUrl] = React.useState(userImage);
  const { register, handleSubmit } = useForm();
  const { toast } = useToast();
  const router = useRouter();
  const updateUserImage = trpc.updateUser.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast({
          variant: 'destructive',
          description: 'Error updating profile',
        });
        console.error('Error updating profile:', error);
        console.error('Error updating profile:', data);
      } else {
        setImgUrl(data.profile_image ?? '');
        router.refresh();
        toast({
          description: 'Profile updated successfully!',
        });
      }
      setIsLoading(false);
    },
  });

  useEffect(() => {
    setImgUrl(imgUrl ?? '');
  }, [imgUrl]);

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

    const bucket = 'users';
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('fileName', data.file[0].name);
    formData.append('location', `/${id}/profile.jpeg`);
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

        updateUserImage.mutate({
          id: id,
          profile_image:
            process.env.NEXT_PUBLIC_BUCKET_BASE_URL +
            '/' +
            bucket +
            fileName.location,
        });
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
        <div className='grid grid-cols-2 grid-rows-1 gap-12'>
          <Button
            variant='secondary'
            type='submit'
            disabled={isLoading}
            className='w-full'
          >
            {isLoading && (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            {buttonText}
          </Button>
          <Input
            id='picture'
            type='file'
            disabled={isLoading}
            className='rounded-full'
            {...register('file', {
              onChange: (e) => {
                setImgUrl(URL.createObjectURL(e.target.files[0]));
              },
            })}
          />
        </div>
      </form>
      {imgUrl != '' ? (
        <div>
          <Avatar className='h-40 w-40'>
            {imgUrl ? (
              <AvatarImage src={imgUrl} alt='pfp' />
            ) : (
              <AvatarFallback></AvatarFallback>
            )}
          </Avatar>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
