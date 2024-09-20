import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    // - amount
    // - created
    // - cardNumber (4 last)
    // - transactionNumber
    // - partnerId
    // - paymentMethod
    // - clientDocument
    // - orderCode
})

export default mongoose.model('Payment', paymentSchema)