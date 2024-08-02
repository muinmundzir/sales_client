'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'

import Headers from '@app/components/Headers'
import { formatDate } from '@app/helpers/format-date'
import { formatCurrencyIDR } from '@app/helpers/format-currency'
import useDebounce from '@app/hooks/useDebounce'
import { ITransaction } from '@app/interfaces/transaction.interface'

export default function Home() {
  const [transactions, setTransactions] = useState<ITransaction[]>([])
  const [query, setQuery] = useState('')

  const debounce = useDebounce(query, 1000)

  const fetchTransaction = useCallback(() => {
    let url = 'http://localhost:3000/sales'

    if (debounce !== undefined) url = url + `?query=${debounce}`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data)
      })
  }, [debounce])

  useEffect(() => {
    fetchTransaction()
  }, [fetchTransaction])

  const calculateTotal = (transcations: ITransaction[]) => {
    const sum = transcations.reduce(
      (total, sale) => total + sale.totalPayment,
      0,
    )

    return sum
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget

    setQuery(value)
  }

  return (
    <Fragment>
      <Headers />
      <main className='mx-auto flex max-w-7xl justify-between p-6 lg:px-8 flex-col space-y-6'>
        <div className='flex self-end items-center space-x-2'>
          <label htmlFor='search'>Cari</label>
          <input
            type='text'
            name='search'
            className='bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
            placeholder='nama kustomer/kode transaksi'
            onChange={handleChange}
          />
        </div>
        <table className='shadow-lg bg-white rounded-lg table-auto'>
          <thead>
            <tr className='mx-10 text-center bg-gray-300/80'>
              <th className='py-3 px-1'>No</th>
              <th className='py-3 px-1'>No Transaksi</th>
              <th className='py-3 px-1'>Tanggal</th>
              <th className='py-3 px-1'>Nama Customer</th>
              <th className='py-3 px-1'>Jumlah Barang</th>
              <th className='py-3 px-1'>Sub Total</th>
              <th className='py-3 px-1'>Diskon</th>
              <th className='py-3 px-1'>Ongkir</th>
              <th className='py-3 px-1'>Total</th>
            </tr>{' '}
          </thead>
          <tbody>
            {transactions &&
              transactions?.map((transaction: ITransaction, index: number) => {
                return (
                  <tr key={transaction?.id} className='text-center'>
                    <td className='py-3 px-1'>{index + 1}</td>
                    <td className='py-3 px-1'>{transaction?.code}</td>
                    <td className='py-3 px-1'>
                      {formatDate(transaction?.date.toString())}
                    </td>
                    <td className='py-3 px-1'>{transaction?.customer?.name}</td>
                    <td className='py-3 px-1'>
                      {transaction?.saleDetail[0].quantity}
                    </td>
                    <td className='py-3 px-1'>
                      {formatCurrencyIDR(transaction?.subtotal.toString())}
                    </td>
                    <td className='py-3 px-1'>
                      {formatCurrencyIDR(transaction?.discount.toString())}
                    </td>
                    <td className='py-3 px-1'>
                      {formatCurrencyIDR(transaction?.shippingCost.toString())}
                    </td>
                    <td className='py-3 px-1'>
                      {formatCurrencyIDR(transaction?.totalPayment.toString())}
                    </td>
                  </tr>
                )
              })}
            {!transactions.length && (
              <tr>
                <td colSpan={10} className='py-3 px-1 text-center'>
                  -- Data kosong --
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className='bg-gray-200 font-bold text-center'>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={4} className='py-3'>
                Grand Total
              </td>
              <td>
                {formatCurrencyIDR(calculateTotal(transactions).toString())}
              </td>
            </tr>
          </tfoot>
        </table>
      </main>
    </Fragment>
  )
}
