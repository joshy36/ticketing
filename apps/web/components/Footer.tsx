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
              <span className='self-center whitespace-nowrap text-2xl font-semibold dark:text-white'>
                Logo Here
              </span>
            </a>
          </div>
          <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6'>
            <div>
              <h2 className='mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white'>
                Resources
              </h2>
              <ul className='font-medium text-gray-500 dark:text-gray-400'>
                <li className='mb-4'>
                  <a href='/#' className='hover:text-gray-300'>
                    Stuff
                  </a>
                </li>
                <li>
                  <a href='/#' className='hover:text-gray-300'>
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className='mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white'>
                Legal
              </h2>
              <ul className='font-medium text-gray-500 dark:text-gray-400'>
                <li className='mb-4'>
                  <a href='#' className='hover:text-gray-300'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-gray-300'>
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className='my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8' />
        <div className='sm:flex sm:items-center sm:justify-between'>
          <span className='text-sm text-gray-500 dark:text-gray-400 sm:text-center'>
            © 2023{' '}
            <a href='/#' className='hover:text-gray-300'>
              Name™
            </a>
            . All Rights Reserved.
          </span>
          <div className='mt-4 flex space-x-5 sm:mt-0 sm:justify-center'>
            <a
              href='#'
              className='text-gray-500 hover:text-gray-900 dark:hover:text-white'
            >
              <InstagramLogoIcon />
              <span className='sr-only'>Instagram page</span>
            </a>
            <a
              href='#'
              className='text-gray-500 hover:text-gray-900 dark:hover:text-white'
            >
              <TwitterLogoIcon />
              <span className='sr-only'>Twitter page</span>
            </a>
            <a
              href='#'
              className='text-gray-500 hover:text-gray-900 dark:hover:text-white'
            ></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
