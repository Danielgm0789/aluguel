const express = require('express')
const cors = require('cors')

const { getUser, setSaldo, getApartamentos, getApartamento, getReservas, setReserva, setCancelar } = require('./database.js')

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.get('/User/:cpf', async (req, res) => {
    const cpf = req.params.cpf
    const dados = await getUser(cpf)
    res.json(dados)
})

app.post('/Saldo', async (req, res) => {
    const { user, valor } = req.body
    const adicionar = await setSaldo(user, Math.abs(valor))
    res.json(adicionar)
})

app.get('/Apartamentos', async (req, res) => {
    const apartamentos = await getApartamentos()
    res.json(apartamentos)
})

app.get('/Apartamento/:id', async (req, res) => {
    const id = req.params.id
    const apartamento = await getApartamento(id)
    res.json(apartamento)
})

app.get('/Reservas/:cpf', async (req, res) => {
    const cpf = req.params.cpf
    const reservas = await getReservas(cpf)
    res.json(reservas)
})

app.post('/Reserva', async (req, res) => {
    const { cliente, apartamento, data_entrada, data_saida } = req.body
    const reserva = await setReserva(cliente, apartamento, data_entrada, data_saida)
    res.json(reserva)
})

app.post('/ReservaCancelar', async (req, res) => {
    const { id_reserva } = req.body
    const cancelar = await setCancelar(id_reserva)
    res.json(cancelar)
})

app.listen(port, () => {
    console.log('App running')
})