import { ICustomer } from "./customer.interface"
import { ITransactionDetail } from "./transaction-detail.interface"

export interface ITransaction {
  id: number
  code: string
  date: Date
  subtotal: number
  customerId: number
  discount: number
  shippingCost: number
  totalPayment: number
  createdAt: Date
  updatedAt: Date
  customer: ICustomer
  saleDetail: [ITransactionDetail]
}
