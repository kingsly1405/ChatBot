from jira import JIRA
import os 
import stat
import shutil

def getJiraTestEvidence(issueName):
    options = {'server': 'https://jira2.cerner.com'}
    jira = JIRA(options)
    #Get issue detail
    issue = jira.issue(issueName)
    dict = {}
    for attachment in  issue.fields.attachment:
        image = attachment.get() 
        if("evidence" in attachment.filename.lower()): 
            jiraFileName = attachment.filename
            # Directory 
            directory = issueName
  
            # Parent Directory path 
            parent_dir = "."
  
            # Path 
            path = os.path.join(parent_dir, directory) 
  
            # Create the directory 
            if(os.path.isdir(path)):
                shutil.rmtree(path)
            os.mkdir(path) 

            print("Directory '%s' created" %directory) 
        
            print jiraFileName
        
            with open("./"+issueName+"/"+attachment.filename, 'wb') as f:        
                f.write(image) 
            dict.update({"fileName":jiraFileName , "attachmentUrl":path, "status": issue.fields.status.name, "issueType" : issue.fields.issuetype.name,
            "summary": issue.fields.summary, "assignee":issue.fields.assignee.displayName, "reporter":issue.fields.reporter.displayName})
    return dict