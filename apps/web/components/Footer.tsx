import { InstagramLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import React from 'react';

export default async function Footer() {
  return (
    <footer className=''>
      <div className='mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8'>
        <div className='md:flex md:justify-between'>
          <div className='mb-6 md:mb-0'>
            <a href='/#' className='flex items-center'>
              {/* <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-8 mr-3"
                  alt="FlowBite Logo"
                /> */}
              <span className='self-center whitespace-nowrap bg-gradient-to-r from-orange-700 to-orange-900 bg-clip-text text-2xl font-semibold text-transparent'>
                Jupiter
              </span>
            </a>
          </div>
          <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6'>
            <div>
              <h2 className='mb-6 text-sm font-semibold uppercase text-foreground'>
                Resources
              </h2>
              <ul className='font-medium text-muted-foreground'>
                <li className='mb-4'>
                  <a href='/#' className='font-light hover:text-foreground'>
                    About
                  </a>
                </li>
                <li>
                  <a href='/#' className='font-light hover:text-foreground'>
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className='mb-6 text-sm font-semibold uppercase text-foreground'>
                Legal
              </h2>
              <ul className='font-medium text-muted-foreground'>
                <li className='mb-4'>
                  <a href='#' className='font-light hover:text-foreground'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href='#' className='font-light hover:text-foreground'>
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className='my-6 border-muted-foreground sm:mx-auto lg:my-8' />
        <div className='sm:flex sm:items-center sm:justify-between'>
          <span className='text-sm font-light text-muted-foreground sm:text-center'>
            © 2023{' '}
            <a href='/#' className='font-light'>
              Name™
            </a>
            . All Rights Reserved.
          </span>
          <div className='mt-4 flex space-x-5 sm:mt-0 sm:justify-center'>
            <a href='#' className='text-foreground dark:hover:text-foreground'>
              <InstagramLogoIcon />
              <span className='sr-only'>Instagram page</span>
            </a>
            <a href='#' className='text-foreground dark:hover:text-foreground'>
              <TwitterLogoIcon />
              <span className='sr-only'>Twitter page</span>
            </a>
            <a
              href='#'
              className='text-foreground dark:hover:text-foreground'
            ></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
