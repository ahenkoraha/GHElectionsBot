
var builder = require('botbuilder');
var http = require("http"),
    url = "http://localhost:29208/ghe/GetPresidentialResults";
     

var data,cards;

 function getData(session){
     console.log('bodee193:');
 var options = {
          //host:"http://localhost",
          port: "29208",
          path:"/ghe/GetPresidentialResults",
          method: "GET",
          headers: {
             "Content-Type":"application/json"
          }
      };

var request= http.request(options, function(response){
    // data is streamed in chunks from the server
    // so we have to handle the "data" event 
    var body = "",
        route;

    response.on("data", function(chunk){
        //console.log('bodee:');
        
        body +=chunk;
    });

    response.on("end", function(err){
         // finished transferring data
        // dump the raw data
        data = JSON.parse(body);       
        buildCarouselMessage(session);
    });
}).on('error',function(e){
     console.log("Got an error:",e);
 });
  request.end();
 } 

function getCardAttachment(session){

    var cardsArr =[];

    data.forEach(function(element) {
     
     cardsArr.push(   new builder.HeroCard(session)
            .title(element.CandidateName)
            .subtitle(element.PartyName+" ["+element.PartyAbrev+"]")
            .text("<b>Vote Percentage: </b>"+element.Percentage+"%  Vote Count: "+element.Votes+"  results for 271 constituencies out of 275")
            .images([
                    builder.CardImage.create(session,element.CandidateImage)
                ])
            )
    });

    return cardsArr;
}

function buildCarouselMessage(session){
        var cards = getCardAttachment(session) ;

        var msg =  new builder.Message(session)
        .textFormat(builder.TextFormat.xml)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards)
        
        session.send(msg);
        session.endDialog();
    }

module.exports.buildCarouselMessage = getData;