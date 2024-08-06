'use client'

import { Fragment, useEffect, useState } from 'react'
import Headers from '@app/components/Headers'
import axios from 'axios'
import { PlusIcon } from '@heroicons/react/24/outline'

import { formatCurrencyIDR } from '@app/helpers/format-currency'
import { formatDate } from '@app/helpers/format-date'
import useDebounce from '@app/hooks/useDebounce'
import { ITransaction } from '@app/interfaces/transaction.interface'
import { AddTransactionTable } from './components/AddTransactionTable'

const Home = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([])
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const debounce = useDebounce(query, 1000)

  useEffect(() => {
    const fetchTransaction = async () => {
      const url = debounce
        ? `${process.env.NEXT_PUBLIC_APP_URL}/sales?query=${debounce}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/sales`
      const response = await axios.get(url)

      if (response.status === 200) {
        setTransactions(response.data)
      }
    }

    fetchTransaction()
  }, [debounce])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value)
  }

  const calculateTotal = (transactions: ITransaction[]) =>
    transactions.reduce((total, sale) => total + sale.totalPayment, 0)

  return (
    <Fragment>
      <Headers />
      <main className='mx-auto flex max-w-7xl flex-col space-y-6 p-6 lg:px-8'>
        {isOpen ? (
          <AddTransactionTable onCancelAdd={() => setIsOpen(false)} />
        ) : (
          <>
            <div className='flex justify-between items-center'>
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className='flex items-center space-x-4 py-2 px-4 border border-blue-500 rounded-lg text-white bg-blue-500 shadow-md hover:bg-blue-400 hover:border-blue-400 text-sm font-bold'
              >
                <PlusIcon className='h-5 w-5 mr-2' />
                Tambah transaksi
              </button>
              <div className='flex items-center space-x-2'>
                <label htmlFor='search'>Cari</label>
                <input
                  id='search'
                  type='text'
                  className='bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
                  placeholder='nama kustomer/kode transaksi'
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <TransactionTable
              transactions={transactions}
              calculateTotal={calculateTotal}
            />
          </>
        )}
      </main>
    </Fragment>
  )
}

const TransactionTable = ({
  transactions,
  calculateTotal,
}: {
  transactions: ITransaction[]
  calculateTotal: (transactions: ITransaction[]) => number
}) => (
  <table className='shadow-lg bg-white rounded-lg table-auto overflow-hidden'>
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
      </tr>
    </thead>
    <tbody>
      {transactions.length ? (
        transactions.map((transaction, index) => (
          <tr key={transaction.id} className='text-center'>
            <td className='py-3 px-1'>{index + 1}</td>
            <td className='py-3 px-1'>{transaction.code}</td>
            <td className='py-3 px-1'>
              {formatDate(transaction.date.toString())}
            </td>
            <td className='py-3 px-1'>{transaction.customer?.name}</td>
            <td className='py-3 px-1'>{transaction.saleDetail[0]?.quantity}</td>
            <td className='py-3 px-1'>
              {formatCurrencyIDR(transaction.subtotal)}
            </td>
            <td className='py-3 px-1'>
              {formatCurrencyIDR(transaction.discount)}
            </td>
            <td className='py-3 px-1'>
              {formatCurrencyIDR(transaction.shippingCost)}
            </td>
            <td className='py-3 px-1'>
              {formatCurrencyIDR(transaction.totalPayment)}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={9} className='py-3 px-1 text-center'>
            -- Data kosong --
          </td>
        </tr>
      )}
    </tbody>
    <tfoot className='bg-gray-200 font-bold text-center'>
      <tr>
        <td colSpan={8} className='py-3'>
          Grand Total
        </td>
        <td>{formatCurrencyIDR(calculateTotal(transactions))}</td>
      </tr>
    </tfoot>
  </table>
)

export default Home
