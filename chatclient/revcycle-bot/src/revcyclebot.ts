import { TurnContext, ConversationState, MessageFactory, CardFactory, Attachment, MediaUrl} from "botbuilder";
import { DialogSet } from "botbuilder-dialogs";
import * as request from 'request';
import * as fs from "fs";
import * as path from "path";

export class RevCycleBot {

    private _dialogs: DialogSet;
    private _conversationState: ConversationState;
    constructor() {

    }
    async getServiceDetail (turnContext) {
        //const knowledgeBaseTopic = turnContext.activity.value.knowledgeBaseTopic;
        const message = await new Promise(resolve => {
            request({
                method: 'Get',
                url: 'http://localhost:5000/list/all'
            }, (error, response, body) => {
                    console.log(error);
                    var stuff = "";
                    var resultJson = JSON.parse(body);
                    
                    console.log(resultJson.length);
                    for (var i = 0, len = resultJson.length; i < len; i++) {
                        stuff = stuff + '\n\n ' + resultJson[i].serviceName;
                    }  
                //let messageWithCarouselOfCards = MessageFactory.text(`* ${body}`);
                    let botResponse = MessageFactory.text(stuff);
                    resolve(botResponse);
            });
        });
        return turnContext.sendActivity(message);
    }

    async getSwaggerDetail(turnContext, serviceName) {
        //const knowledgeBaseTopic = turnContext.activity.value.knowledgeBaseTopic;
        const message = await new Promise(resolve => {
            request({
                method: 'Get',
                url: 'http://localhost:5000/generateSwaggerHtml/allACMService'
            }, (error, response, body) => {
                console.log(error);
                    let stuff = [];
                    let stuff1 = [];
                var resultJson = JSON.parse(body);
                let fileName = "./swaggerhtml/"+serviceName+".html";
                fs.writeFile(fileName, resultJson[serviceName], (err) => {
                    if (err) console.log(err);
                    console.log("Successfully Written to File.");
                });
                let absolutePath = path.resolve(fileName);
                console.log(absolutePath);
                stuff.push(        
                    CardFactory.heroCard(serviceName, [absolutePath], [absolutePath])
                    );
                    
                    let botResponse = MessageFactory.text(`[${serviceName}](${absolutePath})`);
                    
                    resolve(botResponse);
                    
            });
        });
        return turnContext.sendActivity(message);
    }

    async getTestEvidenceDetail(turnContext, issueName) {
        //const knowledgeBaseTopic = turnContext.activity.value.knowledgeBaseTopic;
        const message = await new Promise(resolve => {
            request({
                method: 'Get',
                url: 'http://localhost:5000/testEvidence?issueName=' + issueName
            }, (error, response, body) => {
                console.log(error);
                let jirares: JiraResponse = JSON.parse(body);
                var resultJson = JSON.parse(body);
                let imageUrl = '../' + issueName + '/' + jirares.fileName;
                let absolutePath = path.resolve(imageUrl);
                    console.log(absolutePath);
                    let stuff = [];
                    let botResponse;
                    if (turnContext.activity.text.includes("jira evidence")) {
                        stuff.push(
                            CardFactory.heroCard(issueName, [absolutePath], [absolutePath])
                        );
                        botResponse = MessageFactory.carousel(stuff);
                    } 
                    if (turnContext.activity.text.includes("jira details")) {
                        botResponse = MessageFactory.text(`Summary: ${jirares.summary} \n\n Status: ${jirares.status} \n\n Issue Type: ${jirares.issueType} \n\n Assignee: ${jirares.assignee} \n\n Reporter: ${jirares.reporter} \n\n`);
                    }
                   
                resolve(botResponse);

            });
        });
        return turnContext.sendActivity(message);
    }

    async onTurn(context: TurnContext) {
        if (context.activity.type === 'message') {
            console.log(context.activity.text);
            if (context.activity.text.includes('acm services')) {
                await this.getServiceDetail(context);
            }
            if (context.activity.text.includes('swagger')) {
                console.log(context.activity.text);
                var serviceName = context.activity.text.split('#');
                console.log(serviceName);
                if (serviceName.length > 1) {
                    await this.getSwaggerDetail(context, serviceName[1]);
                }
                else {
                    await context.sendActivity('You can ask me for the swagger with service name prefixed with # ');
                }
            }
            if (context.activity.text.includes('evidence') || context.activity.text.includes('jira')) {
                console.log(context.activity.text);
                var issueName = context.activity.text.split('#');
                console.log(issueName);
                if (issueName.length > 1) {
                    await this.getTestEvidenceDetail(context, issueName[1]);
                }
                else {
                    await context.sendActivity('Your looking for jira evidence or jira details? \n\n query with jira issue name prefixed with # \n\n eg:jira evidence #ACM-1167');
                }
            }
        }
        else {
            await context.sendActivity(`${context.activity.type} even detected`)
        }
    }
}

interface ServiceList {
    serviceName: string;
    openApiUrl: string;
}


interface JiraResponse {

    fileName: string;
    attachmentUrl: string;
    status: string;
    issueType: string;
    summary: string;
    assignee: string;
    reporter: string;
}