
var builder = require('botbuilder');

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

module.exports.buildCarouselMessage = buildCarouselMessage;