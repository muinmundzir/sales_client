import { ITransactionDetail } from './transaction-detail.interface'

export interface IItem {
  id: number
  code: string
  name: string
  price: number
  createdAt: Date
  updatedAt: Date
  saleDetail: ITransactionDetail
}
