const app = new Vue({
    el: '#app',
    data: {
        today: new Date(),
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        selectYear: "",
        selectMonth: "",
        selected: 80,
        options: [
            {text: 1, value: 80},
            {text: 2, value: 81},
            {text: 3, value: 82},
            {text: 4, value: 83},
            {text: 5, value: 84}
        ],
        horas: ["7:00","7:30",,"8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","12:00",
        "12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00"],
        months: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
          ]
        // token: ''
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
            // let fecha1 = (d1.getTime()-d1.getMilliseconds())/1000;

            let fechaFin = document.getElementById('fechaFin').value;
            let horaFin = document.getElementById('horaFin').value;
            let fecha2 = new Date(fechaFin+' '+horaFin);
            // let fecha2 = (d.getTime()-d.getMilliseconds())/1000;

            let room = document.getElementById('room');
            let roomvalue = room[room.selectedIndex].value;

            let createBy = document.getElementById('usr').value;
            let asunto = document.getElementById('reserva').value;
            let descripcion = document.getElementById('descripcion').value;
        
            console.log("entra");
            
            let reserva = {
            "reserva":{
                "start_time": fecha1,
                "end_time": fecha2,
                "room_id": parseInt(roomvalue),
                "create_by": createBy,
                "name": asunto,
                "description": descripcion
            }
            }

            console.log(JSON.stringify(reserva));
            
            
            var url = "http://172.27.9.66:3000/aceptar_reserva";

            this.preventDef(e);
            console.log("Paso");
            
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
            .then(function(response) {
                console.log("Si se ejecutaaaaa")
                return response.json();
            }).then((data) => {
            console.log("data ",data);
            })
            .catch(function(err) {
            console.error(err);
            });     
            
            console.log("Llegué");
            
        },
        saveToken(){
            console.log("entrando");
            var url = "http://172.27.9.66:3000/autenticar";
            
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
            .then(function(response) {
                return response.json();
            })
            .then((data) => {
                var token = data['token']
                console.log(token);
                sessionStorage.setItem("token",token);
                window.location.href = '/formulario.html';
                //this.requestData(token);
            })
            .catch(function(err) {
                console.error(err);
            });
        },
        availability(e){
            const myToken = sessionStorage.getItem("token");
            console.log("my token GG ", myToken);
            
            
            let fechaInicio = document.getElementById('fechaIni').value;
            let horaInicio = document.getElementById('horaIni').value;
            let fecha1 = new Date(fechaInicio+' '+horaInicio);
            // let fecha1 = (d1.getTime()-d1.getMilliseconds())/1000;

            let fechaFin = document.getElementById('fechaFin').value;
            let horaFin = document.getElementById('horaFin').value;
            let fecha2 = new Date(fechaFin+' '+horaFin);
            // let fecha2 = (d.getTime()-d.getMilliseconds())/1000;

            let room = document.getElementById('room');
            let roomvalue = room[room.selectedIndex].value;
        
            console.log("entra");
            
            console.log(JSON.stringify(reserva));
            
            // var url80 = `http://172.27.9.66:3000/${parseInt(roomvalue)}/${fecha1}/${fecha2}`;
            // var url80 = `http://172.27.9.66:3000/80/${fecha1}/${fecha2}`;
            // var url81 = `http://172.27.9.66:3000/81/${fecha1}/${fecha2}`;
            // var url82 = `http://172.27.9.66:3000/82/${fecha1}/${fecha2}`;
            // var url83 = `http://172.27.9.66:3000/83/${fecha1}/${fecha2}`;
            // var url84 = `http://172.27.9.66:3000/84/${fecha1}/${fecha2}`;
            let firstRoom = 80;
            let lastRoom = 84;
            this.preventDef(e);
            console.log(e);
            
            for(let i=firstRoom; i<=lastRoom; i++){
            var url = `http://172.27.9.66:3000/${i}/${fecha1}/${fecha2}`;
            fetch(url,{
                method: 'GET',            
                headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-type': 'application/json',
                'access-token': myToken
                },
                mode: 'cors',
                cache: 'no-cache'              
            })
            .then(function(response) {
                console.log(response);
                showOccupied(response);
                
                return response.json();
            }).then((data) => {
                console.log("data ",data);
            })
            .catch(function(err) {
            console.error(err);
            });     
            }
        },
        showOccupied(response){

        },
        next() {
            this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
            this.currentMonth = (this.currentMonth + 1) % 12;
            showCalendar(this.currentMonth, this.currentYear);
        },    
        previous() {
            this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
            this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
            showCalendar(this.currentMonth, this.currentYear);
        },    
        jump() {
            this.currentYear = parseInt(this.selectYear.value);
            this.currentMonth = parseInt(mes.value);
            this.showCalendar(this.currentMonth, this.currentYear);
        },
        showCalendar(month, year) {
            console.count("Estamos creando la tabla")
            let firstDay = (new Date(year, month)).getDay();
            let daysInMonth = 32 - new Date(year, month, 32).getDate();
            
            let tbl = document.getElementById("calendar-body"); // body of the calendar
            
            // clearing all previous cells
            tbl.innerHTML = "";
            
            // filing data about month and in the page via DOM.
            monthAndYear.innerHTML = this.months[month] + " " + year;
            this.selectYear.value = year;
            this.selectMonth.value = month;
        
            // creating all cells
            let date = 1;
            for (let i = 0; i < 6; i++) {
                // creates a table row
                let row = document.createElement("tr");
        
                //creating individual cells, filing them up with data.
                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < firstDay) {
                        let cell = document.createElement("td");
                        let cellText = document.createTextNode("");
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (date > daysInMonth) {
                        break;
                    }
        
                    else {
                        let cell = document.createElement("td");
                        cell.setAttribute("class", "day");
                        cell.setAttribute("data-toggle", "modal");
                        cell.setAttribute("data-target", "#exampleModal");
                        
                        let cellText = document.createTextNode(date);
                        if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
                            cell.classList.add("bg-info");
                        } // color today's date
                        cell.style.cursor="pointer";
                        cell.value = date+"-"+this.months[month]+"-"+year;
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                        changeTitle(cell);
                        date++;
                    }
                }
        
                tbl.appendChild(row); // appending each row into calendar body.
            }
        
            function changeTitle(cell){
                cell.addEventListener("click", function(){
                    let titulo = document.getElementById('exampleModalLabel');
                    cell = cell.value;
                    titulo.innerHTML = "Disponibilidad en la Fecha "+cell;
                });
            }
        }

    },
    async beforeMount(){
        await this.showCalendar(new Date(),new Date().getMonth());
        console.log(this.today);
    },computed:{
        showNewDate(){
            console.log(this.selectMonth)
            if(this.selectMonth == 0){
                console.log(this.months[this.selectMonth])
            }
           
            if(this.selectYear === ""){
                return "Month And Year";
            }
            console.log(mes)
           return `${this.months[this.selectMonth]} - ${this.selectYear}`
        }
    }   
   
});