function consume(queue) {
    setTimeout(() => {
        const rabbitMQIncomingMessage = { test: 'test node 1234'}
        console.log(rabbitMQIncomingMessage);        
    }, 2000)
}

// ler mensagem
consume('teste')
console.log('salvar mensagem no banco');
console.log('executar pagamento');
console.log('atualizar status');
console.log('invocar webkook');
