import mongoose from 'mongoose'

export const mongooseConnect = () => {
    mongoose
        .connect('mongodb://127.0.0.1:27017/orders_payment')
        .then(() => console.log('mongo has been connected'))
}
