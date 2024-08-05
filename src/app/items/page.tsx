'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'

import Headers from '@app/components/Headers'
import { formatCurrencyIDR } from '@app/helpers/format-currency'
import { IItem } from '@app/interfaces/item.interface'
import { PlusIcon } from '@heroicons/react/24/outline'
import AddItemModal from './components/AddItemModal'
import axios from 'axios'

export default function Home() {
  const [items, setItems] = useState<IItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const fetchItem = useCallback(() => {
    let url = 'http://localhost:3000/items'

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setItems(data)
      })
  }, [])

  useEffect(() => {
    fetchItem()
  }, [fetchItem])

  const handleOnCloseModal = () => {
    setIsOpen(false)
  }

  const handleDelete = async (itemId: number) => {
    try {
      let url = `http://localhost:3000/items/${itemId}`
      const response = await axios.delete(url)

      if (response.status === 200) fetchItem()
    } catch (error) {
      console.error('Failed to delete item', error)
    }
  }

  return (
    <Fragment>
      <Headers />
      <AddItemModal
        fetchData={fetchItem}
        isOpen={isOpen}
        onClose={handleOnCloseModal}
      />
      <main className='mx-auto flex max-w-7xl justify-between p-6 lg:px-8 flex-col space-y-2'>
        <div className='flex justify-end mb-3'>
          <button
            onClick={() => setIsOpen(true)}
            className='flex items-center space-x-4 py-2 px-4 border border-blue-500 rounded-lg text-white bg-blue-500 shadow-md hover:bg-blue-400 hover:border-blue-400 text-sm font-bold'
          >
            <PlusIcon className='h-5 w-5 mr-2' />
            Add item
          </button>
        </div>
        <table className='shadow-lg bg-white rounded-lg table-fixed overflow-hidden'>
          <thead>
            <tr className='mx-10 text-center bg-gray-300/80'>
              <th className='py-3 px-1'>No</th>
              <th className='py-3 px-1'>Kode</th>
              <th className='py-3 px-1'>Nama</th>
              <th className='py-3 px-1'>Harga</th>
              <th className='py-3 px-1'>Action</th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items?.map((item: IItem, index: number) => {
                return (
                  <tr key={item?.id} className='text-center'>
                    <td className='py-3 px-1'>{index + 1}</td>
                    <td className='py-3 px-1'>{item.code}</td>
                    <td className='py-3 px-1'>{item.name}</td>
                    <td className='py-3 px-1'>
                      {formatCurrencyIDR(item.price)}
                    </td>
                    <td className='py-3 px-1'>
                      <button
                        type='button'
                        onClick={() => handleDelete(item.id)}
                        className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            {!items.length && (
              <tr>
                <td colSpan={10} className='py-3 px-1 text-center'>
                  -- Data kosong --
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </Fragment>
  )
}
