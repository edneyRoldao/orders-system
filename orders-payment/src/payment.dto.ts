export type PaymentDTO = {
    amount: number
    cardNumber: string
    partnerId: string
    method: 'CREDIT' | 'DEBIT' | 'CASH' | 'PIX'
    clientDocument: string
    orderCode: string
}