var path = require('path');
var express = require('express');
var app = new express();
var mysql = require('mysql');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(express.static('public'));

app.use(cookieParser());

app.use(session({
	secret: 'secret',
	resave: true,
    cookie: { maxAge: 8*60*60*1000 },
	saveUninitialized: true
}));

app.get('/', (req, res) => {
	if(req.session.username){
		console.log('Home Logged:' + req.session.username);
	}
    res.sendFile(path.resolve(__dirname, 'public/contPersonal.html'));
});

app.get('/muzica', (req, res) => {
	if(req.session.username){
		console.log('Muzica Logged:' + req.session.username);
	}
    res.sendFile(path.resolve(__dirname, 'public/muzica.html'));

});

app.get('/teatru', (req, res) => {
	if(req.session.username){
		console.log('Teatru Logged:' + req.session.username);
	}
    res.sendFile(path.resolve(__dirname, 'public/teatru.html'));
});

app.get('/film', (req, res) => {
	if(req.session.username){
		console.log('Film Logged:' + req.session.username);
	}
    res.sendFile(path.resolve(__dirname, 'public/film.html'));
});

app.get('/crowds', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/crowds.html'));
});

module.exports = function(app) {
    app.use(function(req,res,next) {
        if(req.headers["x-forwarded-proto"] == "http") {
            res.redirect("https://" + req.headers.host + req.url);
            return next();
        } else {
            console.log('Request was not HTTP');
            return next();
        }
    });
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser({
        uploadDir:path.join(__dirname, 'public/upload/temp')
    }));
    app.use(methodOverride());
    app.use(cookieParser('some-secret-value-here'));
    routes(app);
    app.use('/public/', express.static(path.join(__dirname, '../public')));
    if ('development' === app.get('env')) {
        app.use(errorHandler());
    }
    return app;
};

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.post("/abonare", function(req, res) {
    var email = req.body.adresamail;
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "crowds"
	});

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    console.log(email)
    con.query("INSERT INTO newsletter (email) VALUES ('" + email +"')", function (err, result) {
        console.log("1 record inserted");
        con.end();
    });
    res.redirect("/crowds");
});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/inregistrare", function(req, res) {
    var nume = req.body.nume;
    var prenume = req.body.prenume;
    var adresa = req.body.adresa;
    var parola = req.body.parola;

	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "crowds"
	});

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
    con.query("INSERT INTO utilizatori VALUES ('" + nume + "','" + prenume + "','" + adresa + "','" + parola + "')", function (err, result) {
        console.log(nume, prenume, adresa, parola)
        if(err) console.log(err);
        con.end();
    });
    res.redirect("/crowds");
});

app.post('/logare', function(request, response) {
	var adresa = request.body.adresa2;
	var parola = request.body.parola2;

	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "crowds"
	});

	if (adresa && parola) {
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
		con.query('SELECT * FROM utilizatori WHERE adresa = ? AND parola = ?',
		[adresa, parola], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = adresa;
                console.log("Logged in!");
				console.log(request.session.username);
				response.redirect("/crowds");
			} else {
				response.send('Adresa sau parola este incorecta!');
			}
		});

	}
});

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 2525,
  auth: {
    user: 'crowdswebsite@gmail.com',
    pass: 'Crowds10'
	},
  tls: {
          rejectUnauthorized: false
      }
});

app.post("/biletTeatru1", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@aol.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Richard al III-lea',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteţi un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/teatru');
	}
});
app.post("/biletTeatru2", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Amurg',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/teatru');
	}
});
app.post("/biletTeatru3", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Tribut Tchaikovsky',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/teatru');
	}
});
app.post("/biletTeatru4", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Masculin / Feminin',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/teatru');
	}
});
app.post("/biletTeatru5", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Peretele',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/teatru');
	}
});
app.post("/biletTeatru6", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Micul infern',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/teatru');
	}
});

app.post("/biletFilm1", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Interstellar',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/film');
	}
});
app.post("/biletFllm2", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Where the Wild Things Are',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/film');
	}
});
app.post("/biletFilm3", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet The Imitation Game',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/film');
	}
});
app.post("/biletFilm4", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet The Theory of Everything',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/film');
	}
});
app.post("/biletFilm5", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet The Thing',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/film');
	}
});
app.post("/biletFilm6", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet A Beautiful Mind',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/film');
	}
});

app.post("/biletMuzica1", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Thurston Moore',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/muzica');
	}
});
app.post("/biletMuzica2", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Angel Olsen',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/muzica');
	}
});
app.post("/biletMuzica3", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Surf Curse',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/muzica');
	}
});
app.post("/biletMuzica4", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Underworld',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/muzica');
	}
});
app.post("/biletMuzica5", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet ZHU',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/muzica');
	}
});
app.post("/biletMuzica6", function(req, res) {
	if(req.session.username) {
		var mailOptions = {
		  from: 'crowdswebsite@gmail.com',
		  to: req.session.username,
		  subject: 'Rezervare bilet Justin Warfield',
		  text: 'Biletul a fost rezervat! Pentru a anula rezervarea, trimiteti un mail la crowdswebsite@gmail.com.'
		};
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		res.redirect('/muzica');
	}
});

app.get('/delogare',  function (req, res, next)  {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        console.log("Logged out!");
        return res.redirect('/');
      }
    });
  }
});

app.listen(4000, () => {
    console.log('App listening on port 4000')
});
