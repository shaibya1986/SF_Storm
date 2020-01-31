//Install express server
const express = require('express');
const path = require('path');
const request = require('request');
const app = express();

 jwt_consumer_key = '3MVG9G9pzCUSkzZtV08UVbjkudkQJ_wLuu8b2zBsdLVqvFXJG9uZfIoJmawq.VaHbhclfQe8T85TNh5bb301D',
 redirect_uri = "https://sf-storm.herokuapp.com",
 consumer_secret = 'B88C3B5FE45876C8B6CC7CBE64A7BBE9A777F5D745EA2435B7D171B94600DB6A'

app.all('/proxy',  function(req, res) {     
var url = req.header('SalesforceProxy-Endpoint');  
request({ url: url, method: req.method, json: req.body, 
            headers: {'Authorization': req.header('X-Authorization'), 'Content-Type' : 'application/json'}, body:req.body }).pipe(res); 
});                
 
app.get('/webServer', function (req,res){  
	var sfdcURL = 'https://login.salesforce.com/services/oauth2/authorize' ;
	request({ 	url : sfdcURL+'?client_id='+jwt_consumer_key+'&redirect_uri='+redirect_uri+'&response_type=token',  
				method:'GET' 
    }).pipe(res); 
            
} );


// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/SF-Strom'));

app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/SF-Strom/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
 