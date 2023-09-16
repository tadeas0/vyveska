# Vývěska

**Visit https://vyveska.xyz, to see a live version of the app**

## What is it?

Vývěska is a virtual departure board displaying information about buses, trains, metros, and other modes of transportation arriving at Prague stations. It can also be used to track the positions of individual vehicles.

## How does it work?

Vývěska utilises an API provided by [Prague Integrated Transport](https://pid.cz/), which contains real-time information about vehicle positions, arrivals, departures and delays.


## How to run it?

In order to run the application locally, you must first obtain an API key. You can find information on how to obtain one [here](https://api.golemio.cz/v2/docs/openapi/).

After obtaining the API key, you need to create a `.env` file in the root of the repository. The API key should contain following information (replace parts marked with `${}` with your own data):

```
API_KEY=${Your API key}
API_URL="https://api.golemio.cz/v2"
```

After creating the `.env` file, you can run Vývěska in development mode using this command:

```
npm run dev
```
