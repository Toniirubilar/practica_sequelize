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

const cliente = sequelize.define('cliente', {
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
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        msj: "Hola esta es la API de Rubilar"
    })
});

app.get('/clientes', async (req, res) => {
    res.status(200).json({
        ok: true,
        data: await cliente.findAll(),
        msj: "Estos son los clientes"
    })
});

app.get('/clientes/buscar', async (req, res) =>{
    const { query } = req
    const { id } = query
    const busqueda = await cliente.findByPk(id)

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
        const newcliente = await cliente.create({
        nombre,
        apellido,
        localidad,
        direccion,
        celular
        });
        res.status(201).json(newcliente)
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Error al crear el cliente"});
    }
});

app.put('/clientes/update', async (req, res) => {
    const { query } = req;
    const { id } = query;
    const { nombre, apellido, localidad, direccion, celular } =req.body;

    try {
        const actualizarcliente = await cliente.findByPk(id);
        if (!actualizarcliente) {
            return res.status(404).json({error: "Cliente no encontrado"});
        }

        actualizarcliente.nombre = nombre;
        actualizarcliente.apellido = apellido;
        actualizarcliente.localidad = localidad;
        actualizarcliente.direccion = direccion;
        actualizarcliente.celular = celular;

    await actualizarcliente.save();

    res.status(200).json(actualizarcliente)
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Error al actualizar el cliente"});
    }
});

app.delete('/clientes/eliminar', async (req,res) => {
    const { query } = req;
    const { id } = query;

    try {
        const deleteclient = await cliente.findByPk(id);

        if (!deleteclient) {
            res.status(404).json({ error: "Cliente no encontrado" });
        }

        await deleteclient.destroy();
        res.status(200).json({ msj: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el alumno"});
    }
});

app.listen(port, () => {
    console.log(`servidor conectado en el ${port}`)
});


