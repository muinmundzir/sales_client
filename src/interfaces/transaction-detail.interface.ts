export interface ITransactionDetail {
  id: number
  saleId: number
  itemId: number
  price: number
  quantity: number
  discountPercentage: number
  discountAmount: number
  discountPrice: number
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}
