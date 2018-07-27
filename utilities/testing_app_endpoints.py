from requests import get,post
import json

#print(get("http://localhost:5000/api/v1/jobs").json())
print(get("http://localhost:5000/api/v1/job/4").json()[0]) #Gets the first result in the response list
#print(get("http://localhost:5000/api/v1/jobs?q=Continuously&type=responsibilities&sort=asc").json())

#print(post("http://localhost:5000/",json.dumps({"job":"valval"}), headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}))
