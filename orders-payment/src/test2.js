function consume(queue, callbackParameter) {
    setTimeout(() => {
        // mensagem recuperado do rabbit
        const rabbitMQIncomingMessage = { test: 'test node 1234'}
        callbackParameter(rabbitMQIncomingMessage)        
    }, 2000)
}

// ler mensagem
const definicaoCallback = (mensagem) => {
    console.log('mesagem recebida:', mensagem);    
    console.log('salvar mensagem no banco');
    console.log('executar pagamento');
    console.log('atualizar status');
    console.log('invocar webkook');
}

consume('teste', definicaoCallback)
