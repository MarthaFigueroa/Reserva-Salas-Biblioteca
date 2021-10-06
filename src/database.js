const mysql = require('mysql');
const { promisify } = require('util');  //Propiedad promisify de librería util -> Convierte código de callbacks a código de promesas
const {database} = require('./keys');

const mysqlConnection = mysql.createPool(database);

mysqlConnection.getConnection((err, connection)=>{
    if(err){
        // Error cuando se pierde la conexión con la db
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        // Comprobar cuantas conexiones tiene la base de datos.
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        // La conexión con la base de datos fue rechazada, puede ser por errores en las credenciales
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if(connection) connection.release();
    console.log('Db is Connected');
    return;
});

// Cada vez que se realice una consulta a la db,se puede utilizar tanto promesas como async await
mysqlConnection.query = promisify(mysqlConnection.query);


// const mysqlConnection = mysql.createConnection({
//   host: 'localhost',
//   user: 'api',
//   password: 'qwerty',
//   database: 'mrbs'
// });

// mysqlConnection.connect(function (err){
//   if(err){
//     console.log(err);
//     return;
//     }else{
//       console.log('Db is connected');
//     }
// });

module.exports = mysqlConnection; 
