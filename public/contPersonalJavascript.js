function validareEmail(form1) {
    var val = form1.adresa.value;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(val.match(mailformat))
        return true;
    else {
        alert("Adresa nu este valida!");
        form1.adresa.focus();
        return false;
    }
}
