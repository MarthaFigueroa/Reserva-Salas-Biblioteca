const app = new Vue({
    el: '#app',
    data: {
        selected: 92,
        options: [
            {text: 1, value: 92},
            {text: 2, value: 93},
            {text: 3, value: 94},
            {text: 4, value: 95},
            {text: 5, value: 96},
            {text: 6, value: 97}
        ],
        horas: ["7:00","7:30",,"8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","12:00",
        "12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00"]
    },
    methods: {

      preventDef: function(e){
        e.preventDefault();
      },
      requestData(e){
        
        const myToken = sessionStorage.getItem("token");
        console.log("my token GG ", myToken);
        
        let fechaInicio = document.getElementById('fechaIni').value;
        let horaInicio = document.getElementById('horaIni').value;
        
        let fecha1 = new Date(fechaInicio+' '+horaInicio);
        fecha1.setHours(fecha1.getHours() + 2);
        let minutos = new Date(fecha1);
        let min = minutos.getMinutes();

        let fechaFin = document.getElementById('fechaIni').value;
        let horaFin = document.getElementById('horaFin').value;
        let fecha2 = new Date(fechaFin+' '+horaFin);
        fecha2.setHours(fecha2.getHours() + 2);

        let room = document.getElementById('room');
        let roomvalue = room[room.selectedIndex].value;

        let createBy = document.getElementById('usr').value;
        let asunto = document.getElementById('reserva').value;

        var descripcion = document.getElementById("descripcion").value;
        var mailformat = /^\w+([\.-]?\w+)*@alumnos.uneatlantico.es/;
        var mailformat2 = /^\w+([\.-]?\w+)*@uneatlantico.es/;

        var personas = document.getElementById("person").value;

        if(descripcion.match(mailformat) || descripcion.match(mailformat2) ){
          
          let reserva = {
            "reserva":{
              "start_time": fecha1,
              "end_time": fecha2,
              "room_id": parseInt(roomvalue),
              "create_by": createBy,
              "name": asunto+"_Personas:"+personas,
              "description": descripcion
            }
          }

          console.log(JSON.stringify(reserva));
          // localhost:3000
          var url = "https://bibliotecareservas.uneatlantico.es/links/aceptar_reserva";

          if(min==0 || min == 30){
            this.preventDef(e);
            fetch(url,{
              method: 'POST',            
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-type': 'application/json',
                'access-token': myToken
              },
              body: JSON.stringify(reserva),
              mode: 'cors',
              cache: 'no-cache'
            })
            .then(response => {
                return response.json();
              }).then((data) => {
                console.log("data ",data);
                if(data.mensaje == "Ya se ha realizado una reserva diaria."){
                  document.getElementById('no_reserva').click();
                  document.getElementById("modal-content").innerHTML = `
                  YA SE HA REALIZADO UNA RESERVA DIARIA.
                  <br>
                  POR FAVOR VUELVA A INTENTAR EL PR??XIMO D??A.`;
                  document.getElementById("modal-button").innerHTML = `<a type="button" href="/" class="btn btn-primary">Login</a>`;
                }else if(data.mensaje == "No hay disponibilidad"){
                  document.getElementById('no_reserva').click();
                  document.getElementById('modal-content').innerHTML=`
                  YA EXISTE UNA RESERVA A ESA HORA Y SALA.
                  <br>
                  POR FAVOR VUELVA A INTENTAR EN UNA SALA U HORA DIFERENTE`;
                }else if(data.mensaje == "Token inv??lida"){
                  
                  setTimeout(function(){ 
                  document.getElementById('no_reserva').click();
                  document.getElementById("modal-content").innerHTML = `
                  SU SESI??N HA EXPIRADO, VUELVA A INICIAR SESI??N.`;

                    window.location.href = '/';
                  }, 500);

                }else{
                  let id_reserva = data.id;
                  console.log("Id: ",id_reserva);
                  sessionStorage.setItem("id_reserva",id_reserva);
                  //this.signOut();
                  window.location.href = '/ReservaExitosa';
                }
            })
            .catch(function(err) {
              console.error(err);
            })
          }else{
            document.getElementById('no_reserva').click();
            document.getElementById("modal-content").innerHTML = `
            NO SE HA REALIZADO LA RESERVA.
            <br>
            POR FAVOR VUELVA A INTENTAR INGRESANDO UNA HORA V??LIDA.`;
            document.getElementById("modal-button").innerHTML = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;
          }
        }
        else{
          document.getElementById('no_reserva').click();
          document.getElementById("modal-content").innerHTML = `
          NO SE HA REALIZADO LA RESERVA.
          <br>
          POR FAVOR VUELVA A INTENTAR INGRESANDO UNA DIRECCI??N DE CORREO V??LIDA.`;
          document.getElementById("modal-button").innerHTML = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;
        }
      },
      value(){
        var fechaInicio = document.getElementById('fechaIni').value;
        var horaInicio = document.getElementById('horaIni').value;
        var fecha1 = new Date(fechaInicio+' '+horaInicio);
        console.log(fecha1);  
        sessionStorage.setItem("inicio",fecha1);

      },
      valueFin(){
        var fechaFin = document.getElementById('fechaIni').value;
        var horaFin = document.getElementById('horaFin').value;
        var fecha2 = new Date(fechaFin+' '+horaFin);
        let end_time = new Date (fecha2).getTime()/1000.0;        
        console.log("Fecha: "+new Date (end_time*1000).toLocaleString());
        sessionStorage.setItem("fin",fecha2);
        return fecha2;
      },
      valueRoom(){
        var room = document.getElementById('room');
        var value = room[room.selectedIndex].value;
        console.log(value);
      },
      valueUsr(){
        var createBy = document.getElementById('usr').value;
        console.log("Usr: "+createBy);
        
        var asunto = document.getElementById('reserva').value;
        console.log("reserva: "+asunto);
      },
      valueAsunto(){
        var asunto = document.getElementById('reserva').value;
        console.log("reserva: "+asunto);
      },
      valueDescription(){
        var asunto = document.getElementById('descripcion').value;
        console.log("descripcion: "+asunto);
      },
      saveToken(){
        console.log("entrando");
        var url = "http://localhost:3002/autenticar";
        
        fetch(url, {
        method: "POST",
        body: JSON.stringify({ usuario: "asfo", contrasena: "holamundo" }),
        headers: {
            
            "Content-Type": "application/json"
            // "access-token": token
        },
        mode: 'cors',
        cache: 'no-cache'  
        })
        .then(response => {
            return response.json();
        })
        .then((data) => {
            var token = data['token']
            console.log(token);
            sessionStorage.setItem("token",token);
            window.location.href = '/formulario.html';
        })
        .catch(function(err) {
            console.error(err);
        });
      },
      ValidateEmail(){
        var inputvalue = document.getElementById("descripcion").value;
        var mailformat = /^\w+([\.-]?\w+)*@alumnos.uneatlantico.es/;
        var mailformat2 = /^\w+([\.-]?\w+)*@profesores.uneatlantico.es/;
        if(inputvalue.match(mailformat) ||inputvalue.match(mailformat2)){
            console.log("Correct!");
            
            return true;
        }
        else{
            alert("You have entered an invalid email address!");
            return false;
        }
      },
      signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
        console.log('User signed out.');
        });
      },
      deleteReserva(e){
        let all = location.search.split('id=')[1];
        let id = all.split('&')[0];
        let usr = all.split('usuario=')[1];
        console.log("id: ",id);
        console.log("usr: ",usr);

        // localhost:3000
        let url2 = `https://bibliotecareservas.uneatlantico.es/links/eliminar_reserva/${id}/${usr}`;// 

        this.preventDef(e);
        fetch(url2,{
          method: 'DELETE',            
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json'
          },
          mode: 'cors',
          cache: 'no-cache'
        })
        .then(response => {                        
            return response.json();
            
          }).then((data) => {
            console.log("data ",data);
            if(data.message == "Reserva eliminada"){
            document.getElementById('no_reserva2').click();
          }
          
        })
        .catch(function(err) {
        console.error(err);
        })
      }
    },
    mounted() {
      if(localStorage.token) this.token = localStorage.token;
    },
    watch:{
      token(newToken) {
        localStorage.token = newToken;
      }
    }
   
});
