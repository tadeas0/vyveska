import json
import requests

res = requests.get("https://data.pid.cz/stops/json/stops.json")
stops = res.json()

nodes = dict()
node_ids = set()
for i in stops["stopGroups"]:
    altKeys = ["name", "fullName", "idosName", "uniqueName"]
    names = set(i[alt] for alt in altKeys)
    if i["node"] not in node_ids:
        nodes[i["node"]] = {
            "names": [],
            "fullName": i["fullName"],
            "node": i["node"]
        }
    for name in names:
        if name not in nodes[i["node"]]["names"]:
            nodes[i["node"]]["names"].append(name)

with open("src/stops.json", "w") as f:
    json.dump({"nodes": list(nodes.values())}, f, ensure_ascii=False)