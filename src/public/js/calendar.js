let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

let horas = ["7:00","7:30","8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00",
        "13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00"];

let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and year in the page
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells of the calendar
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // Creation of the table row
        let row = document.createElement("tr");

        //Creating individual cells, filing them up with data.
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
                // today's date color
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info");
                } 
                cell.style.cursor="pointer";
                cell.value = months[month]+" "+date+","+year;
                
                cell.appendChild(cellText);
                row.appendChild(cell);
                changeTitle(cell);
                toDate(cell);
                date++;
            }
        }
        tbl.appendChild(row); // appending each row into calendar table body.
    }

    function changeTitle(cell){
        cell.addEventListener("click", function(){
            let titulo = document.getElementById('exampleModalLabel');
            cell = cell.value;
            titulo.innerHTML = "Disponibilidad en la Fecha "+cell;
        });
    }

    function toDate(cell){
        cell.addEventListener("click", function(event){   
            event.preventDefault();
            let dateCell = new Date(cell.value);  
            console.log("Fechaaa: ",dateCell);
            // clearTimeTable();
            timeTable(dateCell);
        });
    }
}

//Clear old table before creating the new one.
function clearTimeTable(){
    for (hora in horas) {
        document.getElementById(horas[hora]).remove();
    }
}

//Create hour column 
function createTimeColumn(){
    showCalendar(currentMonth, currentYear);
    let table = document.getElementById('timeTableBody');
    
    for (hora in horas) {
        // creates a table row.
        let row = document.createElement("tr");
        row.setAttribute('id', horas[hora]);

        let column = document.createElement("td");
        let columnText = document.createTextNode(horas[hora]);
        column.appendChild(columnText);
        row.appendChild(column);
        table.appendChild(row);
    }
}

function timeTable(buttonDate){

    createTimeColumn();

    let rooms = {92:false, 93:false, 94:false, 95:false, 96:false, 97:false};
    // let rooms = [80,81,82,83,84];
    
    for(room in rooms) {

        let disponibilidad = {
            "7:00":true,"7:30":true,"8:00": true,"8:30": true,"9:00": true,"9:30": true,"10:00": true,"10:30": true,"11:00": true,"11:30": true,"12:00": true,"12:30": true,"13:00": true,
            "13:30": true,"14:00": true,"14:30": true,"15:00": true,"15:30": true,"16:00": true,"16:30": true,"17:00": true,"17:30": true,"18:00": true,"18:30": true,"19:00": true
        };
        
        for(hora in disponibilidad){
            let row = document.getElementById(hora);
            let cell = document.createElement("td");
            let textoCell = document.createTextNode('');
            cell.appendChild(textoCell);
            cell.setAttribute("id", room+"_"+hora);
            let disponible = "Disponible";
            cell.classList.add("disponible");
            let text = document.createTextNode(disponible)
            cell.appendChild(text);
            row.appendChild(cell);
        }

        fetchData(room, buttonDate, buttonDate, function(data) {
            
            console.log("ROOM ",room, data);
            console.log("Disponibilidad: ", disponibilidad);

            for(reserva of data.disponibilidad) {
                disponibilidad = Disponibilidad(reserva, disponibilidad);
            }
            
            console.log("JSON", disponibilidad);

            if(data.disponibilidad.length>0){
                displayDisponibilidad(disponibilidad,data.disponibilidad[0].room_id);
                
            }
        }); 
    }
}
function Disponibilidad(reserva, json){
    let startTime = reserva.start_time.split('T');
    startTime = startTime[1].split(':');
    let endTime = reserva.end_time.split('T');
    endTime = endTime[1].split(':');
    console.log("Json: ", json);

    for(let item in json){
        itemTime = item.split(':'); 
        if(parseInt(itemTime[0])>=parseInt(startTime[0]) && parseInt(itemTime[0])<parseInt(endTime[0])){  //Compare the itemTime(Hour: Position 0) with the startTime and endTime 
            if(parseInt(itemTime[0])==parseInt(startTime[0]) && parseInt(itemTime[1])>=parseInt(startTime[1])) json[item] = false;  //Compare the itemHour(Position 0) with the startTime and itemMinute(Position 1) and hours
            else if (parseInt(itemTime[0])!=parseInt(startTime[0])) json[item] = false
        }
        else if(parseInt(itemTime[0])==parseInt(endTime[0])){
            if(parseInt(itemTime[1])<parseInt(endTime[1])) json[item] = false;
        }        
    }
    return json;  //Return update values.
}

function displayDisponibilidad(disponibilidad, room){
        for(hora in disponibilidad){
            let cell = document.getElementById(room+"_"+hora);
            let disponible;
            if(disponibilidad[hora]){
                disponible = "Disponible";
                cell.classList.add("disponible");
            }
            else{
                disponible = "Ocupado";
                cell.classList.add("ocupada");
            }
            cell.innerHTML = disponible;
        }

        room=true;
    
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    sessionStorage.clear();
    auth2.disconnect();
    window.location.href = '/';
  }

function fetchData(room, startTime, endTime, onData){ 
    const myToken = sessionStorage.getItem("token");

    startTime = new Date(startTime).toDateString("yyyyMMdd");
    endTime = new Date(endTime).toDateString("yyyyMMdd");

    startTime2 = startTime.replace(/\s/g, '&');
    endTime2 = endTime.replace(/\s/g, '&');
    //localhost:3002
    var url = 'https://bibliotecareservas.uneatlantico.es/links/' +room+ '/' + startTime2 + '/' + endTime2 + '&24:00'; // ${room}/${startTime}/${endTime} 
    //var url = 'http://172.27.9.66:3000/82/Sat&Mar&14&2020/Sat&Mar&14&2020&24:00';
 
    let reserva = {
        "start_time": startTime,
        "end_time": endTime,
        "room_id": room
    }

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
        return response.json();
    }).then((data) => {
        console.log("Message 2", data.mensaje);
        if(data.mensaje == "Token inválida"){
            
            document.getElementById("exampleModal").style.opacity = "0.8"; 

            document.getElementById('no_reserva').click();
            document.getElementById("modal-content").innerHTML = `
            SU SESIÓN HA EXPIRADO, VUELVA A INICIAR SESIÓN.`;

            setTimeout(function(){ 
		signOut();
            }, 10000);
          }
        onData(data);
    })
    .catch(function(err) {
        let disponibilidad = {
            "8:00": true,"8:30": true,"9:00": true,"9:30": true,"10:00": true,"10:30": true,"11:00": true,"11:30": true,"12:00": true,"12:30": true,"13:00": true,
            "13:30": true,"14:00": true,"14:30": true,"15:00": true,"15:30": true,"16:00": true,"16:30": true,"17:00": true,"17:30": true,"18:00": true,"18:30": true,"19:00": true
        };

        displayDisponibilidad(disponibilidad);
        console.error(err);
    });
}
