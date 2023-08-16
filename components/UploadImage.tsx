'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

const ACCEPTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp'];

export default function UploadImage({ setImgUrl }) {
  const { register, handleSubmit } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    const fileType = data.file[0].name.split('.')[1];
    if (!ACCEPTED_IMAGE_TYPES.includes(fileType)) {
      toast({
        description: 'Image must be a jpeg, jpg, png, or webp',
      });
      return;
    }
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('fileName', data.file[0].name);
    formData.append('location', '/event/');

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
        setImgUrl(fileName.fullRoute);
      } else {
        toast({
          description: 'Error uploading image!',
        });
        console.error('Error uploading image:', res.statusText);
        setImgUrl('');
      }
    } catch (error) {
      toast({
        description: 'Error uploading image!',
      });
      console.error('Error uploading image:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="file" {...register('file')} />
      <Button type="submit">Upload</Button>
    </form>
  );
}
