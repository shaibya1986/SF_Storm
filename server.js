//Install express server
const express = require('express');
const path = require('path');

const app = express();

 jwt_consumer_key = '3MVG9_XwsqeYoueK3il2Xs5otrWbZv4V_6oUY1.v5lcO8YPk_iLjOOx0E7Jkofo8n_Zeoyq0ywAIC97aFBsNC',
 redirect_uri = "https://sf-storm.herokuapp.com",
 consumer_secret = '2136BDFC61EAC9E4D29439647E609C01D99CBDDBF684EAC7F98A78FF3A54BCAC'

function extractAccessToken(err, remoteResponse, remoteBody,res){
	if (err) { 
		return res.status(500).end('Error'); 
	}
	console.log(remoteBody) ;
	var sfdcResponse = JSON.parse(remoteBody); 
	
	//success
	if(sfdcResponse.access_token){				 
		res.writeHead(302, {
		  'Location': 'Main' ,
		  'Set-Cookie': ['AccToken='+sfdcResponse.access_token,'APIVer='+apiVersion,'InstURL='+sfdcResponse.instance_url,'idURL='+sfdcResponse.id]
		});
	}else{
		res.write('Some error occurred. Make sure connected app is approved previously if its JWT flow, Username and Password is correct if its Password flow. ');
		res.write(' Salesforce Response : ');
		res.write( remoteBody ); 
	} 
	res.end();
}

/**
 * Step 1 Web Server Flow - Get Code
 */
app.get('/webServer', function (req,res){  
	// var isSandbox = req.query.isSandbox;
	var state = 'webServerProd';
	var sfdcURL = 'https://login.salesforce.com/services/oauth2/authorize' ;
	// if(isSandbox == 'true'){
	// 	sfdcURL = 'https://test.salesforce.com/services/oauth2/authorize' ;
	// 	state = 'webServerSandbox';
	// }
	
	 request({ 	url : sfdcURL+'?client_id='+
				 jwt_consumer_key+'&redirect_uri='+
				 callbackURL+'&response_type=code&state='+state,  
				method:'GET' 
			}).pipe(res);	 
} );



/**
 * Step 2 Web Server Flow - Get token from Code
 */
app.get('/webServerStep2', function (req,res){  
	// var state = req.query.state;
	var sfdcURL = 'https://login.salesforce.com/services/oauth2/token' ;
	// if(state == 'webServerSandbox'){
	// 	sfdcURL = 'https://test.salesforce.com/services/oauth2/token' ;
	// }
	
	 request({ 	url : sfdcURL+'?client_id='+
				 jwt_consumer_key+'&redirect_uri='+
				 callbackURL+'&grant_type=authorization_code&code='+
				 req.query.code+'&client_secret'+consumer_secret,  
				method:'POST' 
			},
			function(err, remoteResponse, remoteBody) {
				extractAccessToken(err, remoteResponse, remoteBody, res); 
			} 
		);
	 
} );


// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/SF-Strom'));

app.get('https://sf-storm.herokuapp.com/', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/SF-Strom/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);