window.onload = function() {
    var i = 2; var path = new Array();

    path[0] = "/css/slideshow1.jpg";
    path[1] = "/css/slideshow2.jpg";
    path[2] = "/css/slideshow3.jpg";
    path[3] = "/css/slideshow4.jpg";
    path[4] = "/css/slideshow5.jpg";

    var left = document.getElementById('leftButton');
    var right = document.getElementById('rightButton');
    left.onclick = function() {
        i--;
        if(i < 0)
            i = 4;
        document.getElementById('slideshow').style.backgroundImage =
                                                'url(' + path[i] + ')';
    }
    right.onclick = function() {
        i++;
        if(i > 4)
            i = 0;
        document.getElementById('slideshow').style.backgroundImage =
                                                'url(' + path[i] + ')';
    }

    const date = new Date();
    document.getElementById('date').innerHTML = date;

}

function validareEmail(form1) {
    var val = form1.adresamail.value;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(val.match(mailformat))
        return true;
    else {
        alert("Adresa nu este valida!");
        form1.adresamail.focus();
        return false;
    }
}
