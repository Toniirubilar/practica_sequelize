
const { Sequelize, DataTypes, } = require('sequelize');

const sequelize = new Sequelize('testbackend', 'root', 'tonkee2', {
    host: 'localhost',
    dialect: 'mariadb'
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexion completa con la base de datos");
    } catch (error) {
        console.log("error", error);
    }
})();

const clientes = sequelize.define('clientes', {
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    localidad: {
        type:DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    celular: {
        type: DataTypes.BIGINT,
        allowNull: false,
    }

}, {
    tableName: 'clientes',
    timestamps: false
});

const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        msj: "Hola esta es la API de Rubilar"
    })
});

app.get('/clientes', async (req, res) => {
    res.status(200).json({
        ok: true,
        data: await clientes.findAll(),
        msj: "Estos son los clientes"
    })
});

app.get('/clientes/buscar', async (req, res) =>{
    const { query } = req
    const { id } = query
    const busqueda = await clientes.findByPk(id)

     if (busqueda !== null ) res.status(200).json({
        ok: true,
        data: busqueda
    })
    else res.status(404).json({
        ok: false,
        msj: "cliente no encontrado"
    })
    
});

app.post('/clientes/crear', async (req, res) => {
    const { nombre, apellido, localidad, direccion, celular } = req.body;


    try { 
        const newcliente = await clientes.create({
        nombre,
        apellido,
        localidad,
        direccion,
        celular
        });
        res.status(201).json(newcliente)
    } catch (error) {
        console.log("Error al crear al cliente", error);
    }
});


app.listen(8080, () => {
    console.log(`servidor conectado en el ${port}`)
});


