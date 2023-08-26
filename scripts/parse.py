import json
import requests
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("API_KEY")
OUTPUT_DIR = "../src/data"
SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))


def download_stops():
    res = requests.get("https://data.pid.cz/stops/json/stops.json")

    stops = res.json()

    nodes = dict()
    for i in stops["stopGroups"]:
        altKeys = ["name", "fullName", "idosName", "uniqueName"]
        names = set(i[alt] for alt in altKeys)
        gtfsIds = set()
        lines = []

        for stop in i["stops"]:
            if stop["gtfsIds"]:
                for id in stop["gtfsIds"]:
                    gtfsIds.add(id)
            if stop["lines"]:
                lines.extend(stop["lines"])

        if i["node"] not in nodes:
            nodes[i["node"]] = {
                "names": [],
                "fullName": i["fullName"],
                "node": i["node"],
                "gtfsIds": [],
                "lines": list(lines)
            }
        for name in names:
            if name not in nodes[i["node"]]["names"]:
                nodes[i["node"]]["names"].append(name)

        for id in gtfsIds:
            if id not in nodes[i["node"]]["gtfsIds"]:
                nodes[i["node"]]["gtfsIds"].append(id)

    with open(os.path.join(SCRIPT_PATH, OUTPUT_DIR, "stops.json"), "w") as f:
        json.dump({"nodes": list(nodes.values())}, f, ensure_ascii=False)


def download_routes():
    if not API_KEY:
        raise ValueError("Missing API key")

    res_routes = requests.get(
        "https://api.golemio.cz/v2/gtfs/routes",
        params={"limit": 10000},
        headers={"X-Access-Token": API_KEY},
    )

    routes = res_routes.json()
    routes_parsed = [
        {"name": i["route_short_name"], "longName": i["route_long_name"]}
        for i in routes
    ]
    with open(os.path.join(SCRIPT_PATH, OUTPUT_DIR, "routes.json"), "w") as f:
        json.dump({"routes": list(routes_parsed)}, f, ensure_ascii=False)


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    download_stops()
    download_routes()
