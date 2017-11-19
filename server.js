var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(express.static(__dirname + '/img'));

app.get('/',function(req,res){
    res.render('welcome');
});

app.get('/list',function(req,res){
    console.log("REQ :: ", req.session.customers)
    var context = {};
    context.customers = req.session.customers;
    res.render('list', context);
});

app.get('/new',function(req,res){  
    res.render('new');
});


app.post('/addNew',function(req,res){
    var context = {};
    
    if(req.session.curId == undefined) {
        req.session.curId = 0;
        req.session.customers = [];
    }
    
    if(req.body['Add Customer']){
        req.session.customers.push({
            "id":req.session.curId, 
            "name":req.body.name, 
            "party":req.body.party, 
            "number":req.body.number
        });
        req.session.curId++;
    }
  
    context.customersCount = req.session.customers.length;
    context.customers = req.session.customers;
    console.log(context.customers);
    res.render('list',context);
  });

app.post('/done',function(req,res){
    if(req.body['Done']){
        req.session.customers = req.session.customers.filter(function(e){
          return e.id != req.body.id;
        })
    }
    var context = {};
    context.customers = req.session.customers;
    res.render('list', context);
});

app.get('/services',function(req,res){
    res.render('services');
});



app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
