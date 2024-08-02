import { Fragment, useState } from 'react'

import { formatCurrencyIDR } from '@app/helpers/format-currency'
import { formatDate } from '@app/helpers/format-date'
import { ITransaction } from '@app/interfaces/transaction.interface'
import ItemModal from './ItemModal'

export const AddTransactionTable = ({
  transactions,
  onCancelAdd
}: {
  transactions: ITransaction[],
    onCancelAdd: () => void
}) => {
  const [isOpenItemModal, setIsOpenItemModal] = useState(false)

  const handleCloseItemModal = () => {
    setIsOpenItemModal(false)
  }

  return (
    <Fragment>
      {isOpenItemModal && (
        <ItemModal isOpen={isOpenItemModal} onClose={handleCloseItemModal} />
      )}
      <section className='w-1/3 mb-4'>
        <div className='space-y-3 mb-8'>
          <p className='text-xl font-bold border-b border-1 pb-1'>Transaksi</p>
          <div className='grid grid-cols-3 items-center gap-3 relative mt-2 rounded-md'>
            <label className='col-end-2' htmlFor=''>
              No
            </label>
            <input
              type='text'
              name='code'
              className='col-span-2 bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
            />
          </div>
          <div className='grid grid-cols-3 items-center gap-3 relative mt-2 rounded-md'>
            <label className='col-end-2' htmlFor=''>
              Tanggal
            </label>
            <input
              type='date'
              name='date'
              className='col-span-2 bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
            />
          </div>
        </div>
        <div className='space-y-3'>
          <p className='text-xl font-bold border-b border-1 pb-1'>Customer</p>
          <div className='grid grid-cols-3 items-center gap-3 relative mt-2 rounded-md'>
            <label className='col-end-2' htmlFor='id'>
              Kode
            </label>
            <input
              type='text'
              name='id'
              className='col-span-2 bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
            />
          </div>
          <div className='grid grid-cols-3 items-center gap-3 relative mt-2 rounded-md'>
            <label className='col-end-2' htmlFor='name'>
              Nama
            </label>
            <input
              type='text'
              name='name'
              className='col-span-2 bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
            />
          </div>
          <div className='grid grid-cols-3 items-center gap-3 relative mt-2 rounded-md'>
            <label className='col-end-2' htmlFor='phone'>
              Telp
            </label>
            <input
              type='text'
              name='phone'
              className='col-span-2 bg-white w-full border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
            />
          </div>
        </div>
      </section>
      <table className='shadow-lg bg-white rounded-lg table-auto border border-collapse border-slate-100 overflow-hidden'>
        <thead>
          <tr className='mx-10 text-center bg-gray-300/80'>
            <th
              rowSpan={2}
              className='py-2 px-1 bg-blue-500 text-white cursor-pointer'
              onClick={() => setIsOpenItemModal(true)}
            >
              Tambah
            </th>
            <th rowSpan={2} className='py-2 px-1'>
              No
            </th>
            <th rowSpan={2} className='py-2 px-1'>
              Kode Barang
            </th>
            <th rowSpan={2} className='py-2 px-1'>
              Nama Barang
            </th>
            <th rowSpan={2} className='py-2 px-1 text-red-500'>
              Qty
            </th>
            <th colSpan={2} className='py-2 px-1'>
              Harga Bandrol
            </th>
            <th rowSpan={2} className='py-2 px-1'>
              Sub Total
            </th>
            <th rowSpan={2} className='py-2 px-1'>
              Diskon
            </th>
            <th rowSpan={2} className='py-2 px-1'>
              Harga Diskon
            </th>
            <th rowSpan={2} className='py-2 px-1'>
              Total
            </th>
          </tr>
          <tr className='mx-10 text-center bg-gray-300/80'>
            <th className='py-2 text-red-500'>(%)</th>
            <th className='py-2'>(Rp)</th>
          </tr>
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
      </table>
      <div className="flex justify-center items-center gap-5">
        <button
          type='button'
          onClick={() => {}}
          className='inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto'
        >
          Simpan
        </button>
        <button
          type='button'
          data-autofocus
          onClick={onCancelAdd}
          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
        >
          Batal
        </button>
      </div>
    </Fragment>
  )
}
