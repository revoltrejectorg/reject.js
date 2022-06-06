# reject.js
![revolt-reject.js](https://img.shields.io/npm/v/revolt-reject.js)

**Reject** is a compatibility layer for Discord.js developers wanting to port their bots to Revolt. It provides a fast, simple wrapper to simplify moving your code over without any loss in speed.

## Project Status
Reject covers most of the standard Discord.js API that bots would be interacting with. Right now, if your bot doesn't make use of any low-level API's, all that needs to be done on your codebase is logging into Revolt, and passing its events through Reject.

# Examples
Examples can be found [here](https://github.com/revoltrejectorg/reject-examples)

# FAQ
## How can I detect Reject?
The easiest way to detect Reject is to see if the Discord.js class you're receiving has the isRevolt property.
