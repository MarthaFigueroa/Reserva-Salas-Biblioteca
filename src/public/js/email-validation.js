function ValidateEmail(inputText){
    // var mail = document.getElementById("emailPart").value;
    // console.log(mail);
    
    var value = inputText.value
    var inputvalue = value.concat("@alumnos.uneatlantico.es");
    var mailformat = /^\w+([\.-]?\w+)*@alumnos.uneatlantico.es/;
    if(inputvalue.match(mailformat)){
        document.form1.email.focus();
        return true;
    }
    else{
        alert("You have entered an invalid email address!");
        document.form1.email.focus();
        return false;
    }
}