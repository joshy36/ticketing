'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

export default function UploadImage() {
  const { register, handleSubmit } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('fileName', data.file[0].name);

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

      toast({
        description: 'Image uploaded successfully!',
      });
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
