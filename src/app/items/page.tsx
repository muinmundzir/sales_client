'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'

import Headers from '@app/components/Headers'
import { formatDate } from '@app/helpers/format-date'
import { formatCurrencyIDR } from '@app/helpers/format-currency'
import { IItem } from '@app/interfaces/item.interface'

export default function Home() {
  const [items, setItems] = useState<IItem[]>([])

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

  return (
    <Fragment>
      <Headers />
      <main className='mx-auto flex max-w-7xl justify-between p-6 lg:px-8 flex-col space-y-2'>
        <table className='shadow-lg bg-white rounded-lg table-fixed'>
          <thead>
            <tr className='mx-10 text-center bg-gray-300/80'>
              <th className='py-3 px-1'>No</th>
              <th className='py-3 px-1'>Kode</th>
              <th className='py-3 px-1'>Nama</th>
              <th className='py-3 px-1'>Harga</th>
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
                    <td className='py-3 px-1'>{formatCurrencyIDR(item.price.toString())}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </main>
    </Fragment>
  )
}
