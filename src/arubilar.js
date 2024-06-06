const { Sequelize,DataTypes  } = require('sequelize');
const express = require('express');
const cors = require('cors');

const sequelize = new Sequelize('testBackend', 'root', 'lecdlc', {
    host: 'localhost',
    dialect: 'mysql'
});


(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexion Realizada');
    } catch (error) {
        console.log('Conexion Fallida:', error);
    }
})();


const alumno = sequelize.define('alumno', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    }
}, {
    tableName: 'alumnos', // Nombre de la tabla en la base de datos
    timestamps: false     // Deshabilita los timestamps (createdAt y updatedAt)
});

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get('/users',(req,res)=>
    res.status(200).json({
        ok:'true',
        msg:"Hola estas accediendo a la Super API"
    })
)

app.get('/alumnos', async (req,res)=> 

    res.status(200).json({
        ok:'true',
        data: await alumno.findAll(), 
        msg:"Estos Son los Alumnos"
    })
)

app.get('/alumnos/buscar',async (req,res)=>{
    const {query}=req; //desestructurar y es igual a query = req.query
    const {id}=query;  //desestructurar y es igual a id = query.id
 
    const registro = await alumno.findByPk(id)

    if (registro !== null)
        res.status(200).json({
            ok:true,
            data:registro
        })
    else
        res.status(404).json({
            ok:false,
            msg:"No Encontrado"
        })
})

app.post('/alumnos/crear', async (req, res) => {
    const { apellido, nombre, dni, activo, fechaNacimiento, email } = req.body;
 
    // Validar datos de entrada
    if (!apellido || !nombre || !dni || !fechaNacimiento || !email) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        // Crear nuevo alumno
        const nuevoAlumno = await alumno.create({
            apellido,
            nombre,
            dni,
            activo,
            fechaNacimiento,
            email
        });

        // Responder con el alumno creado
        res.status(201).json(nuevoAlumno);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'El DNI o el email ya están en uso' });
        }
        console.error(error);
        res.status(500).json({ error: 'Error al crear el alumno' });
    }
});

app.put('/alumnos/actualizar', async (req, res) => {
    const {query}=req;
    const {id}=query; 
    const { apellido, nombre, dni, activo, fechaNacimiento, email } = req.body;

    try {
        // Buscar el alumno por ID
        const record = await alumno.findByPk(id);

        // Si el alumno no existe, devolver un error
        if (!record) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        // Actualizar los campos
        record.apellido = apellido || record.apellido;
        record.nombre = nombre || record.nombre;
        record.dni = dni || record.dni;
        record.activo = activo !== undefined ? activo : record.activo;
        record.fechaNacimiento = fechaNacimiento || record.fechaNacimiento;
        record.email = email || record.email;

        // Guardar los cambios
        await record.save();
        

        // Responder con el alumno actualizado
        res.status(200).json(record);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'El DNI o el email ya están en uso' });
        }
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el alumno' });
    }
});


// Endpoint para eliminar un alumno
app.delete('/alumnos/eliminar', async (req, res) => {
    const {query}=req;
    const {id}=query; 

    try {
        // Buscar el alumno por ID
        const record = await alumno.findByPk(id);

        // Si el alumno no existe, devolver un error
        if (!record) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        // Eliminar el alumno
        await record.destroy();

        // Responder con un mensaje de éxito
        res.status(200).json({ message: 'Alumno eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el alumno' });
    }
});

app.listen(port,()=>{
    console.log(`Servidor Corriendo en el puerto ${port}`);
});