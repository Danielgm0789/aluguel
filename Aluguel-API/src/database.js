const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

async function getUser(cpf) {
    const [result] = await pool.query('SELECT * FROM cliente WHERE cpf = ?', [cpf])
    return result.length == 0 ? null : result[0]
}

async function setSaldo(user, valor) {
    const [result] = await pool.query('UPDATE cliente SET saldo = saldo + ? WHERE cpf = ?', [valor, user])
    return result.affectedRows == 0 ? null : getUser(user)
}

async function getApartamentos() {
    const [rows] = await pool.query('SELECT * FROM apartamento')
    return rows.length == 0 ? null : rows
}

async function getApartamento(id) {
    const [result] = await pool.query('SELECT * FROM apartamento WHERE id = ?', [id])
    return result.length == 0 ? null : result[0]
}

async function getReservas(cpf) {
    const [rows] = await pool.query('SELECT * FROM reserva WHERE cpf_cliente = ?', [cpf])
    return rows.length == 0 ? null : rows
}

async function getReserva(id) {
    const [result] = await pool.query('SELECT * FROM reserva WHERE id = ?', [id])
    return result.length == 0 ? null : result[0]
}

async function getCancelar(id) {
    const [result] = await pool.query('SELECT * FROM cancelar WHERE id = ?', [id])
    return result.length == 0 ? null : result[0]
}

function DATEDIFF(data_entrada, data_saida){
    var data1 = new Date(data_entrada);
    var data2 = new Date(data_saida);
    return Math.abs(parseInt((data1 - data2) / (24 * 3600 * 1000)));
}

async function setReserva(cliente, apartamento, data_entrada, data_saida) {
    const ap = await getApartamento(apartamento)
    const user = await getUser(cliente)
    if (user.saldo >= (DATEDIFF(data_entrada, data_saida) * ap.diaria)) {
        const [result] = await pool.query(`insert into reserva (cpf_cliente, id_apartamento, data_entrada, data_saida)
        values (?, ?, ?, ?)`, [cliente, apartamento, data_entrada, data_saida])
        const id = result.insertId
        return await getReserva(id)
    } else {
        return { error: 'Saldo para a transação é insuficiente!' }
    }
}

async function setCancelar(id_reserva) {
    const reserva = await getReserva(id_reserva)
    const [result] = await pool.query(`INSERT INTO cancelar (id_reserva, cpf_cliente, id_apartamento, data_entrada, data_saida, preco_total)
    values (?, ?, ?, ?, ?, ?)`, [reserva.id, reserva.cpf_cliente, reserva.id_apartamento, reserva.data_entrada, reserva.data_saida, reserva.preco_total])
    return await getCancelar(result.insertId)
}

module.exports = { getUser, setSaldo, getApartamentos, getApartamento, getReservas, setReserva, setCancelar }