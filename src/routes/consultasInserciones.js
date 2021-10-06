const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

//Validar Reserva
router.post('/aceptar_reserva' , async (req, res) => {
    let data = req.body.reserva;
    let dateS = data.start_time;
    let dateE = data.end_time;
    let message = "";
    let resultS = Math.round(Date.parse(dateS)/1000);
    let resultE = Math.round(Date.parse(dateE)/1000);
    let elementoID = data.room_id;
    let elementoS = (resultS-3600);
    let elementoE = (resultE-3600);


      let demo = mysqlConnection.query('SELECT * FROM mrbs_entry WHERE room_id =' +elementoID +' AND start_time <='+elementoS +' AND end_time >='+elementoE, (err, rows)=>{
      if(rows[0]){
          message='No hay disponibilidad';
          res.send(message);
        } else {  
          const query = `INSERT INTO mrbs_entry(start_time, end_time, room_id, create_by, name, description)VALUES('${elementoS}', '${elementoE}', '${elementoID}', '${data.create_by}', '${data.name}', '${data.description}')`;
          mysqlConnection.query(query, [elementoS, elementoE, elementoID, data.create_by, data.name, data.description], (err) => {
            if(!err){
              res.send('Reserva creada con éxito');
            } else {
              console.log(err);
            } 
          });
        }
    })
});

//Consultar Diponibilidad
router.get('/:room_id/:dateS/:dateE' , (req, res) => {
  const { room_id, dateS, dateE } = req.params;
    let start_time = new Date (dateS).getTime()/1000.0;
    let end_time = new Date (dateE).getTime()/1000.0;

  console.log(new Date (start_time*1000).toLocaleString());
  console.log(new Date (end_time*1000).toLocaleString());
  console.log("--------");  

 sql=`SELECT start_time, end_time, room_id FROM mrbs_entry WHERE room_id = ${room_id} AND (start_time BETWEEN ${start_time} AND ${end_time}) AND (end_time BETWEEN ${start_time} AND ${end_time})`;
  mysqlConnection.query(sql, (err, rows)=>{
    if(!err){
      let contenido = [];
      let inf = rows;
      for (var i in inf){
        if(inf.hasOwnProperty(i)){
          const reserva={
            start_time:new Date(inf[i].start_time*1000),
            end_time:new Date(inf[i].end_time*1000),
            room_id:inf[i].room_id
          }
          contenido.push(reserva);
        }
      } 
      res.json(contenido);

    } else {
      console.log(err);
    }
  });
});


module.exports=router;