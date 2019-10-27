const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

const { Pool, Client } = require('pg')
// var connectionString = "postgres://postgres:postgres@localhost:5432/database";
//
// const clien = new Client({
//   connectionString: connectionString
// });
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'redacted',
  port: 5432,
})


const clien = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'redacted',
  port: 5432,
})

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)

  //set a new item in the Collection
  //with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

  if (command === 'simonsays') {
    client.commands.get('simonsays').execute(message, args)
  }

  if (command === 'schedule') {
    client.commands.get('schedule').execute(message, args)
  }
});

client.login(token);
