var builder = require('botbuilder');
var restify = require('restify');

//setup restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

//create chat bot
var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var typeoptions = ['Parliamentary','Presidential'];
var partyoptions = ['NPP','NDC','NDP','CPP','PPP','INDEPENDENT','PNC'];



bot.dialog('/', 
    new builder.IntentDialog().matches(/^search/i,
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
                session.beginDialog('/searchPresidential');
            }
    
        }
        
    },
    function(session,results){
        session.beginDialog('/searchParty');
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
              buildCarouselMessage(session);
    }
    
]);

bot.dialog('/searchParty',[
    function(session){
        builder.Prompts.confirm(session,"Do you want to further filter "+ session.userData.electiontype+" election results?")

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

function getCardAttachment(session){
    return [
        
            new builder.HeroCard(session)
            .title("Nana Akuffo-Addo")
            .subtitle("New Patriotic Party [NPP]")
            .text("Vote Percentage: 53.85%  \n Vote Count: 5,716,026  results for 271 constituencies out of 275")
            .images([
                    builder.CardImage.create(session,"https://s3.amazonaws.com/thumbsapp-public/2016/candidates/NanaAddoAkufoAddoNPP.jpg")
                ]),
            new builder.HeroCard(session)
            .title("John Dramani Mahama")
            .subtitle(" National Democratic Congress  [NDC]")
            .text("Vote Percentage: 44.40%   Vote Count: 4,713,277  results for 271 constituencies out of 275")
            .images([
                    builder.CardImage.create(session,"https://s3.amazonaws.com/thumbsapp-public/2016/candidates/JohnMahamaNDC.jpg")
                ]),
            new builder.HeroCard(session)
            .title("Paa Kwesi Nduom")
            .subtitle(" Progressive People's Party  [PPP]")
            .text("Vote Percentage: 1%   Vote Count: 105,682  results for 271 constituencies out of 275")
            .images([
                    builder.CardImage.create(session,"https://s3.amazonaws.com/thumbsapp-public/2016/candidates/PaaKwesiNduomPPP.jpg")
                ])
    ];
}

function buildCarouselMessage(session){
        var cards = getCardAttachment() ;
        var msg =  new builder.Message(session)
        .textFormat(builder.TextFormat.xml)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards)
        
        session.send(msg);
        session.endDialog();
    }

