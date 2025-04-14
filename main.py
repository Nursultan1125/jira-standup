import json

with open("2.json", "r") as file:
    data = json.load(file)
    print(data["issues"][0]["fields"]["worklog"]["worklogs"][-1]["created"])
    print(len(data["issues"][3]["fields"]["worklog"]["worklogs"]))