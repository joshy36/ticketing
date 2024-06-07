/**
 * v0 by Vercel.
 * @see https://v0.dev/t/NLGgaETKO4S
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import React from 'react';
import { Button } from '~/components/ui/button';

export default function Menu() {
  return (
    <div className='mx-auto w-full max-w-md rounded-lg p-6 shadow-md '>
      {/* <h1 className='mb-6 text-2xl font-bold text-white'>Our Menu</h1> */}
      <div className='grid grid-cols-1 gap-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <BeefIcon className='h-6 w-6 text-white' />
            <div>
              <h3 className='font-medium text-white'>Cheeseburger</h3>
              <p className='text-gray-400'>
                Beef patty, cheddar cheese, lettuce, tomato, onion
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <p className='font-medium text-white'>$9.99</p>
            <Button
              variant='outline'
              size='icon'
              className='bg-gray-800 hover:bg-gray-700 focus:ring-gray-700'
            >
              <PlusIcon className='h-4 w-4 text-white' />
              <span className='sr-only'>Add to cart</span>
            </Button>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <SaladIcon className='h-6 w-6 text-white' />
            <div>
              <h3 className='font-medium text-white'>Caesar Salad</h3>
              <p className='text-gray-400'>
                Romaine lettuce, croutons, parmesan, Caesar dressing
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <p className='font-medium text-white'>$7.99</p>
            <Button
              variant='outline'
              size='icon'
              className='bg-gray-800 hover:bg-gray-700 focus:ring-gray-700'
            >
              <PlusIcon className='h-4 w-4 text-white' />
              <span className='sr-only'>Add to cart</span>
            </Button>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <CoffeeIcon className='h-6 w-6 text-white' />
            <div>
              <h3 className='font-medium text-white'>Iced Coffee</h3>
              <p className='text-gray-400'>
                Freshly brewed coffee, ice, milk, and sweetener
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <p className='font-medium text-white'>$3.99</p>
            <Button
              variant='outline'
              size='icon'
              className='bg-gray-800 hover:bg-gray-700 focus:ring-gray-700'
            >
              <PlusIcon className='h-4 w-4 text-white' />
              <span className='sr-only'>Add to cart</span>
            </Button>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <CakeIcon className='h-6 w-6 text-white' />
            <div>
              <h3 className='font-medium text-white'>Chocolate Cake</h3>
              <p className='text-gray-400'>
                Rich chocolate cake with chocolate frosting
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <p className='font-medium text-white'>$5.99</p>
            <Button
              variant='outline'
              size='icon'
              className='bg-gray-800 hover:bg-gray-700 focus:ring-gray-700'
            >
              <PlusIcon className='h-4 w-4 text-white' />
              <span className='sr-only'>Add to cart</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BeefIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12.5' cy='8.5' r='2.5' />
      <path d='M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z' />
      <path d='m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5' />
    </svg>
  );
}

function CakeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8' />
      <path d='M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1' />
      <path d='M2 21h20' />
      <path d='M7 8v3' />
      <path d='M12 8v3' />
      <path d='M17 8v3' />
      <path d='M7 4h0.01' />
      <path d='M12 4h0.01' />
      <path d='M17 4h0.01' />
    </svg>
  );
}

function CoffeeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M10 2v2' />
      <path d='M14 2v2' />
      <path d='M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1' />
      <path d='M6 2v2' />
    </svg>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M5 12h14' />
      <path d='M12 5v14' />
    </svg>
  );
}

function SaladIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M7 21h10' />
      <path d='M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z' />
      <path d='M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1' />
      <path d='m13 12 4-4' />
      <path d='M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2' />
    </svg>
  );
}
