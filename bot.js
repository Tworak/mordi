import { Client, GatewayIntentBits, Events, ActivityType, EmbedBuilder } from 'discord.js';
const auth = JSON.parse(fs.readFileSync('./auth.json', 'utf-8'));
import * as fs from 'fs';
import * as mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

// local imports
import handlePresenceUpdate from './src/handlers/presence.js';


// (A) SETTING UP DATABASE
const HNAME = process.env.HOST;
const DBASE = process.env.DATABASE;
const UNAME = process.env.USERNAME;
const PASSWD = process.env.PASSWORD;

// (B) CREATE CONNECTION
const db = mysql.createConnection({
	host: HNAME,
	user: UNAME,
	password: PASSWD,
	database: DBASE
});

// (C) TESTING DATABASE CONNECTION
db.connect(err => {
	if (err) { throw err; }
	console.log(`Connected to mysql on ${HNAME}`);
});


// v13+ requires specifying intents.
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildPresences, // Required for presenceUpdate
		GatewayIntentBits.GuildMessages,  // Required for messageCreate
		GatewayIntentBits.MessageContent  // Required for reading message content
	]
});

// run once when the client is ready
client.once(Events.ClientReady, readyClient => {
	// Log the bot's username and the current date
	console.log(`Logged in as ${client.user.tag}! ${new Date().toString()}`);
	// Set the bot's activity status
	client.user.setActivity('some effin stuff', { type: ActivityType.Playing });
});

client.on(Events.GuildPresenceUpdate, handlePresenceUpdate);

/*
// The 'message' event is now 'messageCreate'
client.on('messageCreate', msg => {
	const LULW = client.emojis.cache.find(emojis => emojis.name === "LULW");
	const Pepega = client.emojis.cache.find(emojis => emojis.name === "Pepega");
	const Pog = client.emojis.cache.find(emojis => emojis.name === "Pog");
	const charspecs = ['fury warrior', 'holy paladin', 'sword rogue', 'dagger rogue', 'arms warrior'];

	// This logic was buggy. `charspecs[0,1,2,3,4]` evaluates to `charspecs[4]`.
	// A map or switch is a cleaner way to handle this.
	const findEmoji = spec => {
		switch (spec) {
			case 'fury warrior':
				return Pepega;
			case 'holy paladin':
				return Pog;
			case 'sword rogue':
			case 'dagger rogue':
				return MonkaHmm; // Assuming MonkaHmm is defined
			case 'arms warrior':
				return PeepoClap; // Assuming PeepoClap is defined
			default:
				return Pog;
		}
	}


	const reactions = {};
	charspecs.forEach(spec => {
		const index = msg.content.toLowerCase().indexOf(spec);

		if (index > -1) {
			reactions[index] = spec;
		}
	});

	Object.keys(reactions)
		.sort()
		.forEach(index => {
			msg.react(findEmoji(reactions[index]));
		});*/
// The 'message' event is now 'messageCreate'
client.on("messageCreate", (msg) => {
	if (msg.content.toLowerCase().indexOf(`bruh`) > - 1) {
		if (msg.author.bot) return
		msg.channel.send(`bruh`)
	}
});

/*
client.on('messageCreate', msg => {
	if (msg.content.toLowerCase().startsWith(`!holydps`)) {
		// v14 uses EmbedBuilder for a cleaner structure.
		const holyDpsEmbed = new EmbedBuilder()
			.setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() }) // .avatarURL is now a function
			.setURL("https://classicdb.ch/?talent#sVxubgstZeb0tb")
			.setDescription("DEEEPS")
			.setColor('#0099ff'); // It's good practice to set a color

		// Embeds must be sent in an array.
		msg.channel.send({ embeds: [holyDpsEmbed] });
	}

	// han fekk ikkje krol blade så deffor må me facepalma
	if (msg.content.toLowerCase().indexOf(`krol blade`) > - 1) {
		if (msg.author.bot) return;
		msg.channel.send("https://tenor.com/view/hopeless-disappointed-ryan-reynolds-facepalm-embarrassed-gif-5436796")

	};
});
*/

client.on('presenceUpdate', handlePresenceUpdate); 

client.login(auth.token);

