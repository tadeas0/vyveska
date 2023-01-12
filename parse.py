import json

with open("stops.json", "r") as f:
    stops = json.load(f)

nodes = []
node_ids = set()
for i in stops["stopGroups"]:
    if i["node"] not in node_ids:
        nodes.append({
            "name": i["name"],
            "fullName": i["fullName"],
            "node": i["node"]})
        node_ids.add(i["node"])

with open("stops_parsed.json", "w") as f:
    json.dump({"nodes": nodes}, f, ensure_ascii=False)