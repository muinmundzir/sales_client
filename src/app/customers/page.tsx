'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'

import Headers from '@app/components/Headers'
import { ICustomer } from '@app/interfaces/customer.interface'
import { PlusIcon } from '@heroicons/react/24/outline'
import AddCustomerModal from './components/AddCustomerModal'
import axios from 'axios'

export default function Home() {
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const fetchCustomer = useCallback(async () => {
    let url = 'http://localhost:3000/customers'

    const response = await axios.get(url)

    if (response.status === 200) {
      setCustomers(response.data)
    }
  }, [])

  useEffect(() => {
    fetchCustomer()
  }, [fetchCustomer])

  const handleOnCloseModal = () => {
    setIsOpen(false)
  }

  const handleDelete = async (customerId: number) => {
    let url = `http://localhost:3000/customers/${customerId}`
    const response = await axios.delete(url)

    if(response.status === 200) fetchCustomer()
  }

  return (
    <Fragment>
      <AddCustomerModal
        fetchData={fetchCustomer}
        isOpen={isOpen}
        onClose={handleOnCloseModal}
      />
      <Headers />
      <main className='mx-auto flex max-w-7xl justify-between p-6 lg:px-8 flex-col space-y-2'>
        <div className='flex justify-end mb-3'>
          <button
            onClick={() => setIsOpen(true)}
            className='flex items-center space-x-4 py-2 px-4 border border-blue-500 rounded-lg text-white bg-blue-500 shadow-md hover:bg-blue-400 hover:border-blue-400'
          >
            <PlusIcon className='h-5 w-5' />
            Add customer
          </button>
        </div>
        <table className='shadow-lg bg-white rounded-lg table-fixed'>
          <thead>
            <tr className='mx-10 text-center bg-gray-300/80'>
              <th className='py-3 px-1'>No</th>
              <th className='py-3 px-1'>Nama</th>
              <th className='py-3 px-1'>Telp</th>
              <th className='py-3 px-1'>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers &&
              customers?.map((customer: ICustomer, index: number) => {
                return (
                  <tr key={customer?.id} className='text-center'>
                    <td className='py-3 px-1'>{index + 1}</td>
                    <td className='py-3 px-1'>{customer.name}</td>
                    <td className='py-3 px-1'>{customer.phone}</td>
                    <td className='py-3 px-1'>
                      <button
                        type='button'
                        onClick={() => handleDelete(customer.id)}
                        className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </main>
    </Fragment>
  )
}
