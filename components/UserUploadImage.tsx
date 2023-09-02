'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';
import { Icons } from './ui/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';

const ACCEPTED_IMAGE_TYPES = ['jpeg'];

function undefinedToNull(value: string | undefined): string | null {
  return value ?? null;
}

export default function EventUploadImage({
  id,
  userImage,
  buttonText,
}: {
  id: string;
  userImage: string | null | undefined;
  buttonText: string;
}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [imgUrl, setImgUrl] = React.useState('');
  const { register, handleSubmit } = useForm();
  const { toast } = useToast();
  const router = useRouter();
  const updateUserImage = trpc.updateUserImage.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast({
          variant: 'destructive',
          description: 'Error updating profile',
        });
        console.error('Error updating profile:', error);
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

  console.log(imgUrl);

  useEffect(() => {
    setImgUrl(userImage ?? '');
  }, []);

  const updateUser = async () => {
    setIsLoading(true);

    updateUserImage.mutate({
      id: id,
      profile_image: imgUrl,
    });
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
        setImgUrl(
          process.env.NEXT_PUBLIC_BUCKET_BASE_URL +
            '/' +
            bucket +
            fileName.location
        );
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
      {imgUrl != '' ? (
        <div>
          <Image
            src={imgUrl}
            alt="Profile Image"
            width={300}
            height={300}
            // className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
      ) : (
        <div></div>
      )}
      <Button disabled={isLoading || imgUrl == ''} onClick={updateUser}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        {buttonText}
      </Button>
    </>
  );
}
