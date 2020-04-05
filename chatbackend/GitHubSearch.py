from github import Github

def getAcmServicesSwaggerYAML():
    git = Github(base_url="https://github.cerner.com/api/v3", login_or_token="cce506c2c21be6b3bbff92e523ffd56ec43c4366")
    # Search repo
    results = git.search_code(query='org:AcuteCaseManagementServices filename:openapi.yaml')

    list = []
    for file in results:
        if("openapi.yaml" in file.download_url):
            dict = {}
            dict.update({"serviceName":file.repository.name , "openApiUrl": file.download_url})
            list.append(dict)
    #retrun dictionary
    return list