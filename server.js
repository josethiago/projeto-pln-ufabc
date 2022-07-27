// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();


var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
 
const OpenWeatherMapHelper = require('openweathermap-node');

// For temperature in Fahrenheit use units=imperial
// For temperature in Celsius use units=metric
const helper = new OpenWeatherMapHelper(
	{
		APPID: 'd8ff33461e38363901c7cc712d49dca1',
		units: "metric"
	}
);

var buscaCep = require('busca-cep');


// https://www.npmjs.com/package/openweathermap-node-with-units-preference




// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});




app.post("/aulaPLN", function(request, response) {
  
  //response.json({"fulfillmentText" : "Previsao do tempo"});
  
  var intentName = request.body.queryResult.intent.displayName;
  
  if (intentName == "temperatura") {
    
    var cidade  = request.body.queryResult.parameters['cidade'];
    
    //response.json({"fulfillmentText" : "Previsao do tempo para " + cidade});
    
    helper.getCurrentWeatherByCityName("" + cidade, (err, currentWeather) => {
	    if (err) {
		    console.log(err);
        
        response.json({"fulfillmentText": "Cidade ''" +  cidade + " '' nao encontrada"});
	    }
	    else {
	     	console.log(currentWeather);
        
         var temperaturaAtual  = currentWeather.main.temp;
         var temperaturaMaxima = parseInt(currentWeather.main.temp_max);
         var temperaturaMinima = parseInt(currentWeather.main.temp_min);
        
         /*response.json({"fulfillmentText" :
          "Cidade: " + currentWeather.name + "\n" +
          "Temperatura Atual: " + temperaturaAtual + "º" + "\n" +
          "Temperatura Máxima: " + temperaturaMaxima + "º" + "\n" +
          "Temperatura Mínima: " + temperaturaMinima
         });*/ 
        
         response.json({"fulfillmentMessages":
           [
            {
              "card": {
                 "title": "Previsão do Tempo",
                 "subtitle": "Cidade = " + currentWeather.name,
                  "imageUri": "https://cdn.glitch.com/ed90767e-7d31-49a0-944f-1e1f4f07b572%2Fprevisao.png?v=1615488815869"
              }
            },
            {
             "text" :{
                "text": ["Temperatura atual = " + temperaturaAtual + "º"]
             }
            },
            {
             "text" :{
                "text": ["Temperatura máxima = " + temperaturaMaxima + "º"]
             }
            },
            {
             "text" :{
                "text": ["Temperatura mínima = " + temperaturaMinima + "º"]
             }
            }
             
           ]
        });
        
	    }
    });
  }
  
  
  
  if (intentName == "processo.seletivo") {
   
    
    response.json({
      "fulfillmentMessages": [
              {
                "card": {
                  "title": "Processo Seletivo",
                  "subtitle": "Bem vindo ao nosso Processo seletivo",
                  "imageUri": "https://cdn.glitch.com/ed90767e-7d31-49a0-944f-1e1f4f07b572%2Fprocesso-seletivo.jpg?v=1615488821787"
                }
              },
              {
                "text" :{
                   "text": [
                      "Os campi da UFABC estão sediados nos municípios de Santo André e São Bernardo do Campo"
                  ]
                }
              },
              {
                "image":{
                  
                    "imageUri": "https://www.ufabc.edu.br/images/imagens_a_ufabc/campus-sa.jpg",
                    "accessibilityText": "Campus em Santo André"
                  
                }
              },
              {
                "image":{
                  
                    "imageUri": "https://www.ufabc.edu.br/images/imagens_a_ufabc/campus-sbc.jpg",
                    "accessibilityText": "Campus em São Bernardo do Campo"
                  
                }
              },
              {
                "text" :{
                   "text": [
                      "Nossos campi são os melhores do Brasil"
                  ]
                }
              },
              {
                "text" :{
                   "text": [
                      "Voce quer participar do processo seletivo?"
                  ]
                }
              }
            ]
     });
 
  }
  
  if ( intentName == "processo.seletivo - yes"  ) {
    
    var aluno_cep = request.body.queryResult.parameters['aluno-cep'];
    
    // http://viacep.com.br/
    
    buscaCep(aluno_cep, {sync: false, timeout: 1000})
      .then(endereco => {
      
       var aluno_nome  = request.body.queryResult.parameters['aluno-nome'];
       var aluno_cpf   = request.body.queryResult.parameters['aluno-cpf'];
       var aluno_curso = request.body.queryResult.parameters['aluno-curso'];  
      
       var aluno_endereco = endereco.logradouro+"-"+endereco.bairro+","+endereco.localidade+"-"+endereco.uf+"--"+endereco.cep;
        
       response.json({"fulfillmentText": aluno_nome + ", CPF: " + aluno_cpf + ", curso: " + aluno_curso + ", o seu endereço completo é: " + aluno_endereco});
       
    })
  
  }

});



 
  

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});






  







// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
