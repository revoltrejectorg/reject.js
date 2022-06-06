# reject.js
![revolt-reject.js](https://img.shields.io/npm/v/revolt-reject.js)

**Reject** is a compatibility layer for Discord.js developers wanting to port their bots to Revolt. It provides a fast, simple wrapper to simplify moving your code over without any loss in speed.

## Project Status
Reject covers most of the standard Discord.js API that bots would be interacting with. Right now, if your bot doesn't make use of any low-level API's, all that needs to be done on your codebase is logging into Revolt, and passing its events through Reject.

# Examples
Below is a basic example of Reject usage in Typescript.
```ts
import { Client as RevoltClient } from "revolt.js";
import { Client, Message } from "discord.js";
import { Message as RejectMessage, Client as RejectClient } from "revolt-reject.js";

function onMessage(message: Message) {
  console.log(`Received message from ${message.channel.id} with content ${message.content}`);
}

function botReady(client: Client) {
  console.log("Bot is ready!");
}

console.log("Starting Revolt bot...");
const revoltBot = new RevoltClient();

// Here we pass a Reject class, which will make the above onMessage function work with Revolt.
revoltBot.on("message", (message) => onMessage(new RejectMessage(message) as any));

revoltBot.on("ready", () => {
  botReady(new RejectClient(revoltBot) as any);
  console.log("Revolt bot is ready!");
});

revoltBot.loginBot(revoltToken);
```

# FAQ
## How can I detect Reject?
The easiest way to detect Reject is to see if the Discord.js class you're receiving has the isRevolt property.
