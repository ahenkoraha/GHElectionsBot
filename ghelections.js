var builder = require('botbuilder');
var restify = require('restify');
var buildCarouselMessage = require('./helpers').buildCarouselMessage;
var helper = require('./helpers');


//=========================================================
// Bot Setup
//=========================================================
//setup restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

//create chat bot
var connector = new builder.ChatConnector(
    //appId: process.env.MICORSOFT_APP_ID,
    //appPassword: process.env.MICROSOFT_APP_PASSWORD
);
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var typeoptions = ['Parliamentary','Presidential'];
var partyoptions = ['NPP','NDC','NDP','CPP','PPP','INDEPENDENT','PNC'];
var options = {
          //host:"http://localhost",
          port: "29208",
          path:"/ghe/GetPresidentialResults",
          method: "GET",
          headers: {
             "Content-Type":"application/json"
          }
      };

//Create LUIS recognizer that points at model 
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/27a48bc9-e9aa-489c-8315-c684b19848a9?subscription-key=12921c53d19644299b30f2f58c7a228e&staging=true&verbose=true&timezoneOffset=0.0&spellCheck=true&q=';
var recognizer = new builder.LuisRecognizer(model);


//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', 
    new builder.IntentDialog({recognizers: [recognizer]}).matches(/^Find/i,
    [
        function(session){
            session.send("Not implemented LUIS yet");
        }
    ])
    .onDefault(
    [
    function(session) {
        session.beginDialog('/sayHello');
       
    },
    function(session, results,next) {      
        if (results.response.entity){
            session.userData.electiontype = results.response.entity;
            if (results.response =='Parliamentary'){
                session.beginDialog('/searchParlaimentary');
            }
            else{
                //console.log(getData());
                session.beginDialog('/searchPresidential');
            }
        }
        
    }
])
);
bot.dialog('/sayHello',[
        function(session){
           // session.send("Hey! I'm AbatooBot. I can provide you with information about Ghana Election Results. Please choose an option below or send 'Search' to start searching for Ghana Election Results");
            builder.Prompts.choice(session,"Hey! I'm AbatooBot. I can provide you with information about Ghana Election Results. Already know what you are looking for? Send me what you are looking for like 'Search for NDP Presidential Eclection Results in Ashanti Region'. If you are not sure what you are looking for, I have some options below to help you. Let's start with the kind of election results you want",typeoptions)
        }
]);

bot.dialog('/searchParlaimentary',[
    function(session){
        session.send("you want to search for Parliamentary results :P");
        session.endDialog();
    }
]);

bot.dialog('/searchPresidential',[
    function(session){
        
              buildCarouselMessage(session,options,helper.getCardPresNational);
    }
    
]);

bot.dialog('/searchCandidate',[
    function(session,args){
        //builder.Prompts.confirm(session,"Do you want to further filter "+ session.userData.electiontype+" election results?")

        console.log(args);
        options.path = "/ghe/GetPresidentialResultsByCandidate/" + args.data.replace(" ","");
        buildCarouselMessage(session,options,helper.getCardPresRegionalByCandidate);

    },
    function(session,results){
        if(results.response == true){
            builder.Prompts.choice(session, "You can further drill down "+ session.userData.electiontype+" election results to specific Political Parties",partyoptions);
        }
        else{
            session.endDialog("Thank you! Let me know if I can help with any other information")
        }
    },
    function(session, results){
       buildCarouselMessage(session);
    }
]);
bot.beginDialogAction('searchCandidate','/searchCandidate');
