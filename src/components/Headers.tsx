'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  PopoverGroup,
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

export default function Headers() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className='bg-gray-300'>
      <nav
        aria-label='Global'
        className='mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8'
      >
        <div className='flex lg:flex-1'>
          <a href='#' className='-m-1.5 p-1.5'>
            <span className='sr-only'>Your Company</span>
            <img
              alt=''
              src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
              className='h-8 w-auto'
            />
          </a>
        </div>
        <div className='flex lg:hidden'>
          <button
            type='button'
            onClick={() => setMobileMenuOpen(true)}
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
          >
            <span className='sr-only'>Open main menu</span>
            <Bars3Icon aria-hidden='true' className='h-6 w-6' />
          </button>
        </div>
        <PopoverGroup className='hidden lg:flex lg:gap-x-12'>
          <Link
            href='/'
            className='text-sm font-semibold leading-6 text-gray-900'
          >
            Transactions
          </Link>{' '}
          <Link
            href='/items'
            className='text-sm font-semibold leading-6 text-gray-900'
          >
            Items
          </Link>{' '}
          <Link
            href='/customers'
            className='text-sm font-semibold leading-6 text-gray-900'
          >
            Customers
          </Link>{' '}
        </PopoverGroup>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className='lg:hidden'
      >
        <div className='fixed inset-0 z-10' />
        <DialogPanel className='fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <a href='#' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Your Company</span>
              <img
                alt=''
                src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
                className='h-8 w-auto'
              />
            </a>
            <button
              type='button'
              onClick={() => setMobileMenuOpen(false)}
              className='-m-2.5 rounded-md p-2.5 text-gray-700'
            >
              <span className='sr-only'>Close menu</span>
              <XMarkIcon aria-hidden='true' className='h-6 w-6' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-gray-500/10'>
              <div className='space-y-2 py-6'>
                <div className='flex flex-col gap-2'>
                  <Link
                    href='/'
                    className='text-sm font-semibold leading-6 text-gray-900'
                  >
                    Transactions
                  </Link>{' '}
                  <Link
                    href='/items'
                    className='text-sm font-semibold leading-6 text-gray-900'
                  >
                    Items
                  </Link>{' '}
                  <Link
                    href='/customers'
                    className='text-sm font-semibold leading-6 text-gray-900'
                  >
                    Customers
                  </Link>{' '}
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
