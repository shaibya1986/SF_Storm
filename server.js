//Install express server
const express = require('express');
const path = require('path');
const request = require('request');
const app = express();

 jwt_consumer_key = '3MVG9_XwsqeYoueK3il2Xs5otrWbZv4V_6oUY1.v5lcO8YPk_iLjOOx0E7Jkofo8n_Zeoyq0ywAIC97aFBsNC',
 redirect_uri = "https://sf-storm.herokuapp.com",
 consumer_secret = '2136BDFC61EAC9E4D29439647E609C01D99CBDDBF684EAC7F98A78FF3A54BCAC'

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
 