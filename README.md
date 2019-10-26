# DisClocks
Clocks for your Discord servers :V

## Installation
Make sure you have a bot token for the Discord API.

Download the program and Node.js v10+, and run npm install to set it up. Then just run the batch file or `node .` to start it.

## Configuration
Set `mod_roles` in the configuration file generated on the first run to an array including roles authorized
to modify server clocks. This has some default values that may or may not work out of the box.

## Usage
`^addclock <channel ID> <tz timezone> [custom abbreviation]`: Creates a clock on voice channel <channel ID>. You can get
channel IDs by enabling Developer Mode in Settings->Appearance and then right-clicking on a channel to "Copy ID".

This should only be used on voice channels, since they can have spaces and capital letters in their names.

Example: `^addclock 637737139022462987 America/Los_Angeles`

This creates a clock on channel `637737139022462987` with a time in PST or PDT.

Example: `^addclock 637737139022462987 America/Los_Angeles PDT`

This creates a clock on channel `637737139022462987` with a time in PST or PDT, but it will have the label PDT no
matter what, even if it is incorrect.

`^removeclock <channel ID>`: Removes a clock from a voice channel.
