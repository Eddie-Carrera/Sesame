var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var formidable = require('formidable');


var routes = require('./routes/index');
var users = require('./routes/users');
var classifier = require('./routes/classifier')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/classifier/atl', classifier);
app.use('/users', users);

var watson = require('watson-developer-cloud');
var fs = require('fs');

var visual_recognition = watson.visual_recognition({
  username: '2fe200d9-06a6-4a98-8f9f-957561779fa7',
  password: '6hyceO6DhSI5',
  version: 'v2-beta',
  version_date: '2015-12-02'
});

/* GET home page. */
app.get('/class', function(req, res) {
  console.log('******/class/atl****')
  var id = req.query.id;
  console.log('params: ' + Object.keys(req.query))
  console.log('ALL: ' + Object.keys(req))

console.log('id params: ' + id);



console.log('2')
  var params = {
  	name: 'atl',
  	positive_examples: fs.createReadStream('./atlPic.zip'),
  	negative_examples: fs.createReadStream('./atlFalsePic.zip')
  };

console.log('calling createClassifier')

  visual_recognition.createClassifier(params,
  	function(err, response) {
     	 if (err){
         console.log(err);
         res.send(err);
       }
      else{
        console.log('3')
        console.log(response);
        res.send(JSON.stringify(response, null, 2));
      }
  });
});


/* GET classify picture */
// app.get('/classify', function(req, res) {
//   var params = {
//   	images_file: fs.createReadStream('./test.jpg'),
//   	classifier_ids: fs.readFileSync('./classifierlist.json')
//   };
//
//   visual_recognition.classify(params,
//   	function(err, response) {
//      	 if (err){
//          console.log(err);
//          res.send(err);
//        }
//       	 else{
//            console.log(JSON.stringify(response, null, 2));
//            res.send(JSON.stringify(response, null, 2));
//          }
//   });
// });

app.post('/classify', function(req, res) {
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, function(err, fields, files) {
    console.log(files.image.path)

      var params = {
          images_file: fs.createReadStream(files.image.path),
          classifier_ids: fs.readFileSync('./classifierlist.json')
      };
      // console.log(params.image_file)

      visual_recognition.classify(params, function(err, response) {

          if (err){
          console.log("Return error"+err);
              res.send(err);
            }
          else {
              // var labels = res.images[0].labels.map(function(label)
              // {
              //     return label.label_name;
              // });

              console.log(JSON.stringify(response, null, 2));
              res.send(JSON.stringify(response, null, 2));
          }
      });

  });
});




/* GET classify picture */
app.get('/delete', function(req, res) {
  var id = req.query.id;
 console.log('Le id'+ id)
  visual_recognition.deleteClassifier({
  	classifier_id: id },
  	function(err, response) {
  	 if (err){
       console.log(err);
       res.send(err);
     }
  	 else{
       console.log(JSON.stringify(response, null, 2));
       res.send(JSON.stringify(response, null, 2));

     }
});

});

/* GET classify picture */
app.get('/classinfo', function(req, res) {
  var id = req.query.id;
 console.log('Le id'+ id)
  visual_recognition.getClassifier({
  	classifier_id: id },
  	function(err, response) {
  	 if (err){
       console.log(err);
       res.send(err);
     }
  	 else{
       console.log(JSON.stringify(response, null, 2));
       res.send(JSON.stringify(response, null, 2));

     }
});

});



/* GET classify picture */
app.get('/classlist', function(req, res) {

  visual_recognition.listClassifiers({},
	function(err, response) {
	 if (err){
     console.log(err);
     res.send(err);

   }
	 else{
     console.log(JSON.stringify(response, null, 2));
     res.send(JSON.stringify(response, null, 2));
   }
	});

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
