
var builder = require('botbuilder');
var http = require("http"),
    url = "http://ghelections.azurewebsites.net/ghe/GetPresidentialResults";
     

var data,cards;

 function getData(session,options,callfunction){
     //console.log('bodee193:');

var request= http.request(options, function(response){
    // data is streamed in chunks from the server
    // so we have to handle the "data" event 
    console.log(options);
    var body = "",
        route;

    response.on("data", function(chunk){
        //console.log('bodee:');
        
        body +=chunk;
    });
    //console.log(body);
    response.on("end", function(err){
         // finished transferring data
        // dump the raw data
        data = JSON.parse(body); 
        console.log("logging data");    
        console.log(data);  
        
        buildCarouselMessage(session,callfunction);
        
        
    });
}).on('error',function(e){
     console.log("Got an error:",e);
 });
  request.end();
 } 

function getCardPresNational(session){

    var cardsArr =[];

    data.forEach(function(element) {
     
     cardsArr.push(   new builder.HeroCard(session)
            .title(element.CandidateName)
            .subtitle(element.PartyName+" ["+element.PartyAbrev+"]")
            .text("Vote Percentage: "+element.Percentage+"%  Vote Count: "+element.Votes+"  results for 271 constituencies out of 275")
            .images([
                    builder.CardImage.create(session,element.CandidateImage)
                ])
            .buttons([
                builder.CardAction.dialogAction(session,"searchCandidate",element.CandidateName.replace(" ",""),"More Details")    
            ])
            )
    });

    return cardsArr;
}

function getCardPresRegionalByCandidate(session){

    var cardsArr =[];

    data.forEach(function(element) {
     
     cardsArr.push(   new builder.HeroCard(session)
            .title(element.RegionName)
            .subtitle(element.CandidateName +" - "+element.PartyName+" ["+element.PartyAbrev+"]")
            .text("Vote Percentage: "+element.Percentage+"%  Vote Count: "+element.Votes+"  results for 271 constituencies out of 275")
            .images([
                    builder.CardImage.create(session,element.CandidateImage)
                ])
            /*.buttons([
                builder.CardAction.dialogAction(session,"searchCandidate",element.CandidateName,"More Details")    
            ])*/
            )
    });

    return cardsArr;
}

function buildCarouselMessage(session, callfunction){
    if (data == [] || data ==""){
        var msg = "Sorry, could not find any information. Can I help you with anything else?";
    }
    else{
        var cards = callfunction(session) ;

        var msg =  new builder.Message(session)
        .textFormat(builder.TextFormat.xml)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards)
    }
        session.send(msg);
        session.endDialog();

    }

module.exports.buildCarouselMessage = getData;
module.exports.getCardPresNational = getCardPresNational;
module.exports.getCardPresRegionalByCandidate = getCardPresRegionalByCandidate;