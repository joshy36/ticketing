## Run locally

This is a script that will upload all the metadata to IPFS for an event.

It pulls the name, description, image, and seat from the database.

Make sure to update your envars and the `id` variable to the correct id.

Install dependencies
```bash
npm i
```
Run the script
```bash
node metadata.js <event-id>
```
