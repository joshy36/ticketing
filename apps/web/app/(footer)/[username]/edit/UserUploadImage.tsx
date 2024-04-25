'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { toast } from 'sonner';
import { Input } from '~/components/ui/input';
import { useRouter } from 'next/navigation';
import { trpc } from '../../../_trpc/client';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';

const ACCEPTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp', 'heic'];

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
  const [cancelImgUrl, setCancelImgUrl] = React.useState(userImage);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const { register } = useForm();
  const router = useRouter();
  const updateUserImage = trpc.updateUser.useMutation({
    onSettled(data, error) {
      if (!data) {
        toast.error('Error updating profile');
        console.error('Error updating profile:', error);
        console.error('Error updating profile:', data);
      } else {
        setImgUrl(data.profile_image ?? '');
        router.refresh();
        toast.success('Profile updated successfully');
      }
      setIsLoading(false);
    },
  });

  useEffect(() => {
    setImgUrl(imgUrl ?? '');
  }, [imgUrl]);

  const save = async (data: any) => {
    setIsLoading(true);

    if (data.length == 0) {
      toast.error('Must choose a file to upload');
      setIsLoading(false);
      return;
    }

    const fileType = data[0].name.split('.')[1];
    if (!ACCEPTED_IMAGE_TYPES.includes(fileType)) {
      toast.error('Image must be a jpeg, jpg, png, webp, or heic');
      setIsLoading(false);
      return;
    }

    const bucket = 'users';
    const formData = new FormData();
    formData.append('file', data[0]);
    formData.append('fileName', data[0].name);
    formData.append('location', `/${id}/profile.${fileType}`);
    formData.append('bucket', bucket);
    formData.append('id', id);

    try {
      toast('Uploading image...');
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(baseUrl + `/api/image/upload`, {
        method: 'POST',
        body: formData,
        cache: 'no-store',
      });

      if (res.ok) {
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
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button type='button' variant='secondary'>
            Update Profile Picture
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Profile Picture</AlertDialogTitle>
            <AlertDialogDescription>
              <div className='flex flex-col'>
                <Input
                  id='picture'
                  type='file'
                  disabled={isLoading}
                  className='my-2 rounded-full'
                  {...register('file', {
                    onChange: (e) => {
                      setImgUrl(URL.createObjectURL(e.target.files[0]));
                      setSelectedFile(e.target.files);
                    },
                  })}
                />
                {imgUrl != '' ? (
                  <div className='flex items-center justify-center py-2'>
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
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setImgUrl(cancelImgUrl);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await save(selectedFile);
              }}
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {imgUrl != '' ? (
        <div className='flex items-center justify-start pt-4'>
          <Avatar className='h-32 w-32'>
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
    </div>
  );
}
