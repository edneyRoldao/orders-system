import mongoose from 'mongoose'

function cardLengthCheck(cardNumber: string | any[]) {
    let sum = 0;
    for (let i = 0; i < cardNumber.length; i++) {
        let intValue = parseInt(cardNumber[i]);
        if (i % 2 === cardNumber.length % 2) {
            intValue *= 2;
            if (intValue > 9) {
                intValue -= 9;
            }
        }
        sum += intValue;
    }
    return sum % 10 === 0;
}

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'O valor total é obrigatório'],
        min: [0.01, 'O valor do pagamento deve ser maior que zero'],
    },
    cardNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(value: string) {
                const formattedValue = value.replace(/[\s-]/g, '');
                return formattedValue.length >= 13 && cardLengthCheck(formattedValue);
            },
            message: 'O número do cartão de crédito é inválido',
        }
    },
    transactionNumber: {
        type: String,
        required: [true, 'Numero da transação é obrigatório'],
        unique: true,
        trim: true,
    },
    partnerId: {
        type: String,
        required: [true, 'partner id is required'],
    },
    method: {
        type: String,
        required: [true, 'O metodo de pagamento é obrigatório'],
        enum: {
            values: ['CREDIT', 'DEBIT', 'CASH','PIX'],
            message: [`Método de pagamento inválido. Escolha entre: credit, debit, cash, pix'`],
        },
    },
    status: {
        type: String,
        required: [true, 'O metodo de pagamento é obrigatório'],
        enum: {
            values: ['SUCCESS', 'FAILED'],
            message: [`Método de pagamento inválido. Escolha entre: credit, debit, cash, pix'`],
        },
    },
    statusMessage: {
        type: String,
        require: true
    },
    clientDocument: {
        type: String,
        required: [true, 'Documento do cliente é obrigatório'],
        match: [/^\d{11}$|^\d{14}$/, 'Documento deve ser um CPF (11 números) ou CNPJ (14 números)'],
        trim: true,
    },
    orderCode: {
        type: String,
        required: [true, 'O codigo do pedido é obrigatório' ],
        trim: true,
    }
}, { timestamps: true, versionKey: false })

paymentSchema.index({ partnerId: 1, clientDocument: 1, orderCode: 1, transactionNumber: 1 })

export default mongoose.model('Payment', paymentSchema)