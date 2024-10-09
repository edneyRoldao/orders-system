function consume(queue, callbackParameter) {
    setTimeout(() => {
        // mensagem recuperado do rabbit
        const rabbitMQIncomingMessage = { test: 'test node 1234'}
        callbackParameter(rabbitMQIncomingMessage)        
    }, 2000)
}

function consumeAsync(queue) {
    const promise = new Promise((resolve, reject) => {
        consume(queue, (message) => {
            resolve(message)
        })
    })
    return promise
}

async function testPromisse() {
    const message = await consumeAsync('teste')
    console.log('mesagem recebida:', message);    
    console.log('salvar mensagem no banco');
    console.log('executar pagamento');
    console.log('atualizar status');
    console.log('invocar webkook');
}

testPromisse()