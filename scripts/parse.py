import json
import requests

res = requests.get("https://data.pid.cz/stops/json/stops.json")
stops = res.json()

nodes = dict()
for i in stops["stopGroups"]:
    altKeys = ["name", "fullName", "idosName", "uniqueName"]
    names = set(i[alt] for alt in altKeys)
    gtfsIds = set()

    for stop in i["stops"]:
        if stop["gtfsIds"]:
            for id in stop["gtfsIds"]:
                gtfsIds.add(id)


    if i["node"] not in nodes:
        nodes[i["node"]] = {
            "names": [],
            "fullName": i["fullName"],
            "node": i["node"],
            "gtfsIds": []
        }
    for name in names:
        if name not in nodes[i["node"]]["names"]:
            nodes[i["node"]]["names"].append(name)
    
    for id in gtfsIds:
        if id not in nodes[i["node"]]["gtfsIds"]:
            nodes[i["node"]]["gtfsIds"].append(id)

with open("../src/stops.json", "w") as f:
    json.dump({"nodes": list(nodes.values())}, f, ensure_ascii=False)