let conta;
let saldo;

const btnAcessarConta = document.getElementById('acessar')
const btnDepositarSaldo = document.getElementById('adicionarSaldo')
const contaAtual = document.getElementById('conta')
const cpf = document.getElementById('cpf')
const saldoValor = document.getElementById('valor')
const deposito = document.getElementById('adicionar')
const contentApartamentos = document.getElementById('content-apartamentos')
const contentReservas = document.getElementById('content-reservas')
const h2Reservas = document.getElementById('h2-tab2')

btnAcessarConta.addEventListener('click', acessarConta)
btnDepositarSaldo.addEventListener('click', depositarSaldo)

async function atualizar() {
    try {
        const response = await axios.get(`http://localhost:3000/User/${conta}`)
        const result = response.data
        saldo = result.saldo
        contaAtual.innerText = `CPF ${result.cpf} Logado`
        saldoValor.innerText = result.saldo.toFixed(2)
        listarApartamentos()
        listarReservas()
    } catch (err) {
        console.error(err)
    }
}

async function acessarConta() {
    try {
        if (cpf.value) {
            const response = await axios.get(`http://localhost:3000/User/${cpf.value}`)
            const result = response.data
            cpf.value = ''
            if (result) {
                conta = result.cpf
                atualizar()
                cpf.placeholder = 'Conta acessada com sucesso.'
                cpf.style.borderColor = 'green'
            } else {
                cpf.placeholder = 'Digite um CPF valido.'
                cpf.style.borderColor = 'red'
            }
        } else {
            cpf.placeholder = 'Acesso requer CPF válido para acessar.'
            cpf.style.borderColor = 'red'
        }
    } catch (err) {
        console.error(err)
    }
}

async function depositarSaldo() {
    try {
        if (conta) {
            if (deposito.value) {
                const dados = {
                    user: conta,
                    valor: deposito.value
                }
                const response = await axios.post(`http://localhost:3000/Saldo`, dados)
                const result = response.data
                conta = result.cpf
                atualizar()
                deposito.value = ''
                deposito.placeholder = 'Deposito realizado com sucesso.'
                deposito.style.borderColor = 'green'
            } else {
                deposito.placeholder = 'Informe o valor desejado para efetuar o depósito.'
                deposito.style.borderColor = 'red'
            }
        } else {
            deposito.value = ''
            deposito.placeholder = 'É necessario acessar uma conta antes de depositar.'
            deposito.style.borderColor = 'red'
            cpf.placeholder = 'Acesso requer CPF válido para acessar.'
            cpf.style.borderColor = 'red'
        }
    } catch (err) {
        console.log(err)
    }
}

async function listarReservas() {
    try {
        contentReservas.innerHTML = ''
        if (conta) {
            const response = await axios.get(`http://localhost:3000/Reservas/${conta}`)
            const result = response.data
            if (result) {
                h2Reservas.innerText = ''
                result.forEach(element => {
                    createReserva(element)
                });
            } else {
                h2Reservas.innerText = 'Essa conta não possui reserva.'
            }
        } else {
            h2Reservas.innerText = 'Acesse sua conta para visualizar suas reservas.'
        }
    } catch (err) {
        console.error(err)
    }
}

async function listarApartamentos() {
    try {
        contentApartamentos.innerHTML = ''
        const response = await axios.get('http://localhost:3000/Apartamentos')
        const result = response.data
        if (result) {
            result.forEach(element => {
                createApartamentos(element)
            });
        }
    } catch (err) {
        console.error(err)
    }
}

async function reservarApartamento(id, data_entrada, data_saida) {
    try {
        const dados = {
            cliente: conta,
            apartamento: id,
            data_entrada: data_entrada,
            data_saida: data_saida
        }
        const response = await axios.post(`http://localhost:3000/Reserva`, dados)
        atualizar()
    } catch (err) {
        console.error(err)
    }
}

function newElement(type, parent, attribute, text) {
    const element = document.createElement(type)
    Object.keys(attribute).forEach(attr => element.setAttribute(attr, attribute[attr]))
    if (text) {
        element.innerText = text
    }
    parent.appendChild(element)
    return element
}

async function reservarApartamento(id, data_entrada, data_saida) {
    try {
        const dados = {
            cliente: conta,
            apartamento: id,
            data_entrada: data_entrada,
            data_saida: data_saida
        }
        const response = await axios.post(`http://localhost:3000/Reserva`, dados)
        atualizar()
    } catch (err) {
        console.error(err)
    }
}

function createApartamentos(element) {
    const divApartamentos = newElement('div', contentApartamentos, { id: 'apartamentos' })
    const h3Apartamento = newElement('h3', divApartamentos, { id: 'apartamento' }, `${element.condominio} - ${element.local_apartamento}`)
    const pDiaria = newElement('p', divApartamentos, { id: 'diaria' }, `Diaria: R$${element.diaria.toFixed(2)}`)
    const gridDivApartamentos = newElement('div', divApartamentos, { id: 'apartamento-grid' })
    const buttonApartamento = newElement('button', divApartamentos, { id: 'btn-alugar-apartamento-lista' }, `Reservar esse apartamento.`)
    const pCondominio = newElement('p', gridDivApartamentos, { id: 'condominio' }, `Condominio: ${element.condominio}`)
    const pQuartos = newElement('p', gridDivApartamentos, { id: 'quartos' }, `Quartos: ${element.quartos}`)
    const pCozinha = newElement('p', gridDivApartamentos, { id: 'cozinha' }, `Cozinha: ${element.cozinha}`)
    const pAndar = newElement('p', gridDivApartamentos, { id: 'andar' }, `Andar: ${element.andar}º Andar`)
    const pBanheiros = newElement('p', gridDivApartamentos, { id: 'banheiros' }, `Banheiros: ${element.banheiros}`)
    const pElevador = newElement('p', gridDivApartamentos, { id: 'elevador' }, `Elevador: ${element.elevador}`)
    const pApartamento = newElement('p', gridDivApartamentos, { id: 'apartamento' }, `Apartamento: ${element.apartamento}`)
    const pGaragem = newElement('p', gridDivApartamentos, { id: 'garagem' }, `Garagem: ${element.garagem}`)
    const pPortaria = newElement('p', gridDivApartamentos, { id: 'portaria' }, `Portaria: ${element.portaria}`)

    buttonApartamento.addEventListener('click', () => {
        let entradaData;
        let saidaData;

        const modal = newElement('div', contentApartamentos, { id: 'modal' })
        const modalcontent = newElement('div', modal, { id: 'modal-content' })
        const closeButton = newElement('span', modalcontent, { id: 'close' }, 'x')
        const h3ApartamentoReservar = newElement('h3', modalcontent, { id: 'reservar-apartamento-titulo' }, `${element.condominio} - ${element.local_apartamento}`)
        const divDatas = newElement('div', modalcontent, { id: 'div-datas' })
        const spanDataEntrada = newElement('span', divDatas, { id: 'span-data-entrada' }, 'Data de Entrada: ')
        const dataEntrada = newElement('input', divDatas, { type: 'date' })
        const spanDataSaida = newElement('span', divDatas, { id: 'span-data-saida' }, 'Data de Saida: ')
        const dataSaida = newElement('input', divDatas, { type: 'date'})
        const precoTotal = newElement('p', modalcontent, { id: 'preco-pagar-reserva' }, `Valor Total: R$${getPreco().toFixed(2)}`)
        const divButtonAlertReservar = newElement('div', modalcontent, { id: 'div-button-alert-reserva' })
        const buttonReservar = newElement('button', divButtonAlertReservar, { id: 'submit-button-reservar' }, 'Reservar')
        const alertReservar = newElement('p', divButtonAlertReservar, { id: 'alert-reservar', style: 'color: red' })

        function getPreco() {
            if (entradaData && saidaData) {
                return parseInt((new Date(entradaData) - new Date(saidaData)) / (24 * 3600 * 1000)) < 0 ? Math.abs(parseInt((new Date(entradaData) - new Date(saidaData)) / (24 * 3600 * 1000)) * element.diaria) : 0
            } else {
                return 0
            }
        }

        closeButton.addEventListener('click', () => { 
            modal.style.display = 'none' 
        })

        dataEntrada.addEventListener('change', () => {
            if (dataEntrada.value) {
                entradaData = dataEntrada.value
                precoTotal.innerText = `Valor Total: R$${getPreco().toFixed(2)}`
            } 
        })

        dataSaida.addEventListener('change', () => {
            if (dataSaida.value) {
                saidaData = dataSaida.value
                precoTotal.innerText = `Valor Total: R$${getPreco().toFixed(2)}`
            } 
        })

        buttonReservar.addEventListener('click', function () {
            if (!conta) {
                alertReservar.innerText = 'Acesso requer CPF válido para concluir esta operação.'
                return
            }
            if (!entradaData || !saidaData) {
                alertReservar.innerText = 'Por favor, preencha todos os campos obrigatórios para concluir a reserva.'
                return
            }
            if (new Date(entradaData) > new Date(saidaData)) {
                alertReservar.innerText = 'A data de entrada não pode ser posterior à data de saída.'
                return
            }
            if (getPreco() == 0) {
                alertReservar.innerText = 'A data de entrada e saída não podem ser idênticas.'
                return
            }
            if (parseInt((new Date(entradaData) - new Date()) / (24 * 3600 * 1000)) <= 1) {
                alertReservar.innerText = 'Desculpe, as reservas devem ser feitas com pelo menos 3 dias de antecedência.'
                return
            }
            if (getPreco() > saldo) {
                alertReservar.innerText = 'Seu saldo atual não cobre a estadia. Recarregue para garantir sua reserva.'
                return 
            }

            reservarApartamento(element.id, dataEntrada.value, dataSaida.value)
            modal.style.display = 'none'
        })
    })
}

async function getApartamento(id) {
    const response = await axios.get(`http://localhost:3000/Apartamento/${id}`)
    return response.data
}

async function createReserva(element) {
    const response = await getApartamento(element.id_apartamento)

    function formataData(date){
        let data = new Date(date),
        dia = data.getDate().toString().padStart(2, '0'),
        mes = (data.getMonth()+1).toString().padStart(2, '0'),
        ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    const divApartamentos = newElement('div', contentReservas, { id: 'reserva' })
    const h3Apartamento = newElement('h3', divApartamentos, { id: 'apartamento' }, `${response.condominio} - ${response.local_apartamento}`)
    const pDataEntrada = newElement('p', divApartamentos, { id: 'data-entrada' }, `Data de Entrada: ${formataData(element.data_entrada)}`)
    const pDataSaida = newElement('p', divApartamentos, { id: 'data-saida' }, `Data de Saida: ${formataData(element.data_saida)}`)
    const pPrecoTotal = newElement('p', divApartamentos, { id: 'preco-total' }, `Valor Pago: R$${element.preco_total.toFixed(2)}`)
    const divCancelar = newElement('div', divApartamentos, { id: 'div-cancelar-reserva' })
    const alertCancelar = newElement('p', divCancelar, { id: 'alert-cancelar' })
    const buttonCancelar = newElement('button', divApartamentos, { id: 'cancelar-reserva'}, `Cancelar.`)
    const buttonCancelarSim = newElement('button', divCancelar, { id: 'cancelar-reserva-sim'}, `Sim.`)
    const buttonCancelarNao = newElement('button', divCancelar, { id: 'cancelar-reserva-nao'}, `Não.`)
    
    buttonCancelar.addEventListener('click', () => {
        if (parseInt((new Date(element.data_entrada) - new Date()) / (24 * 3600 * 1000)) > 1) {
            buttonCancelar.style.display = 'none'
            alertCancelar.innerText = 'Você tem certeza que deseja cancelar esse reserva ?'
            divCancelar.style.display = 'block'
        } else {
            buttonCancelar.style.backgroundColor = 'red'
            buttonCancelar.innerText = 'Não é mais possivel cancelar'
            const timeOut = setTimeout(() => {
                buttonCancelar.style.backgroundColor = '#d1a889';
                buttonCancelar.innerText = 'Cancelar.'
            }, 3000)
        }
    })

    buttonCancelarNao.addEventListener('click', () => {
        divCancelar.style.display = 'none'
        buttonCancelar.style.display = 'block'
    })

    buttonCancelarSim.addEventListener('click', async () => {
        if (parseInt((new Date(element.data_entrada) - new Date()) / (24 * 3600 * 1000)) <= 1) {
            alertCancelar.innerText = 'Desculpe, cancelar uma reserva precisa ser com pelo menos 3 dias de antecedência.'
            return
        }
        const response = await axios.post('http://localhost:3000/ReservaCancelar', { id_reserva: element.id})
        atualizar()
    })
}