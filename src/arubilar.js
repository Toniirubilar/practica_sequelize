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