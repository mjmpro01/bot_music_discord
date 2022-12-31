/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable functional/immutable-data */
import fs from 'node:fs';
import path from 'node:path';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Player } from 'discord-player';
import { BaseGuild, Client , Collection, IntentsBitField  } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildVoiceStates]
}); 

// List of all commands
const commands: readonly unknown[] = [];
// @ts-ignore
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands"); // E:\yt\discord bot\js\intro\commands
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
console.log("🚀 ~ file: index.ts:23 ~ commandFiles", commandFiles)

commandFiles.map( file => {
  const filePath = path.join(commandsPath, file);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const command = require(filePath);
  console.log("🚀 ~ file: index.ts:28 ~ command", command)
  // @ts-ignore
  client.commands.set(command.default.data.name, command);
  // @ts-ignore
  commands.push(command.default.data.toJSON());
})

// Add the player on the client
// @ts-ignore
client.player = new Player(client, {
  ytdlOptions: {
      quality: "highestaudio",
      highWaterMark: 1 << 25
  }
})

client.on('ready', async () => {
  // Get all ids of the servers
  await console.log(client.guilds.cache);
  const guild_ids = client.guilds.cache.map((guild: any) => guild.id);
  console.log("🚀 ~ file: index.ts:53 ~ constguild_ids=client.guilds.cache.map ~ guild_ids", guild_ids)
  // @ts-ignore
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  guild_ids.map((guildId) => {
    rest
        // @ts-ignore
      .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), {
        body: commands,
      })
      .then(() =>
        console.log('Successfully updated commands for guild ' + guildId)
      )
      .catch(console.error);
  });
});

client.on("interactionCreate", async interaction => {
  if(!interaction.isCommand()) return;
  console.log("🚀 ~ file: index.ts:67 ~ interaction", interaction)
  // @ts-ignore
  const command = client.commands.get(interaction.commandName);
  console.log("🚀 ~ file: index.ts:69 ~ command", command)
  if(!command) return;

  try
  {
      await command.default.execute({client, interaction});
      console.log("🚀 ~ file: index.ts:74 ~ interaction", interaction)
  }
  catch(error)
  {
      console.error(error);
      await interaction.reply({content: "There was an error executing this command"});
  }
});

client.login(process.env.TOKEN);