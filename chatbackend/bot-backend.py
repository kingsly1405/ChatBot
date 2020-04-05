import GitHubSearch as git
import GenerateSwaggerCard as generateSwagger
import GetJiraCard as jira
import flask
from flask import request, jsonify
import json

app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/list/all', methods=['GET'])
def listACMServices():
    return json.dumps(git.getAcmServicesSwaggerYAML(), indent = 4)

@app.route('/generateSwaggerHtml/allACMService', methods=['GET'])
def generateSwaggerHtml():
    dict = {}
    for obj in git.getAcmServicesSwaggerYAML():
       dict.update(generateSwagger.generateSwaggerHtml(obj['openApiUrl'],obj['serviceName']))
    return dict

@app.route('/testEvidence', methods=['GET'])
def getJiraTestEvidence():
    issueName = request.args.get('issueName')
    return jira.getJiraTestEvidence(issueName)
   
    
app.run()