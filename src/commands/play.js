"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var builders_1 = require("@discordjs/builders");
var discord_player_1 = require("discord-player");
var discord_js_1 = require("discord.js");
exports["default"] = {
    data: new builders_1.SlashCommandBuilder()
        .setName("play")
        .setDescription("play a song from YouTube.")
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName("search")
            .setDescription("Searches for a song and plays it")
            .addStringOption(function (option) {
            return option.setName("searchterms").setDescription("search keywords").setRequired(true);
        });
    })
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName("playlist")
            .setDescription("Plays a playlist from YT")
            .addStringOption(function (option) { return option.setName("url").setDescription("the playlist's url").setRequired(true); });
    })
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName("song")
            .setDescription("Plays a single song from YT")
            .addStringOption(function (option) { return option.setName("url").setDescription("the song's url").setRequired(true); });
    }),
    execute: function (_a) {
        var client = _a.client, interaction = _a.interaction;
        return __awaiter(void 0, void 0, void 0, function () {
            var queue, embed, url, result, song, url, result, playlist, url, result, song;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Make sure the user is inside a voice channel
                        if (!interaction.member.voice.channel)
                            return [2 /*return*/, interaction.reply("You need to be in a Voice Channel to play a song.")];
                        return [4 /*yield*/, client.player.createQueue(interaction.guild)];
                    case 1:
                        queue = _b.sent();
                        if (!!queue.connection) return [3 /*break*/, 3];
                        return [4 /*yield*/, queue.connect(interaction.member.voice.channel)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        embed = new discord_js_1.EmbedBuilder();
                        if (!(interaction.options.getSubcommand() === "song")) return [3 /*break*/, 6];
                        url = interaction.options.getString("url");
                        return [4 /*yield*/, client.player.search(url, {
                                requestedBy: interaction.user,
                                searchEngine: discord_player_1.QueryType.YOUTUBE_VIDEO
                            })
                            // finish if no tracks were found
                        ];
                    case 4:
                        result = _b.sent();
                        // finish if no tracks were found
                        if (result.tracks.length === 0)
                            return [2 /*return*/, interaction.reply("No results")
                                // Add the track to the queue
                            ];
                        song = result.tracks[0];
                        return [4 /*yield*/, queue.addTrack(song)];
                    case 5:
                        _b.sent();
                        embed
                            .setDescription("**[" + song.title + "](" + song.url + ")** has been added to the Queue")
                            .setThumbnail(song.thumbnail)
                            .setFooter({ text: "Duration: " + song.duration });
                        return [3 /*break*/, 12];
                    case 6:
                        if (!(interaction.options.getSubcommand() === "playlist")) return [3 /*break*/, 9];
                        url = interaction.options.getString("url");
                        return [4 /*yield*/, client.player.search(url, {
                                requestedBy: interaction.user,
                                searchEngine: discord_player_1.QueryType.YOUTUBE_PLAYLIST
                            })];
                    case 7:
                        result = _b.sent();
                        if (result.tracks.length === 0)
                            return [2 /*return*/, interaction.reply("No playlists found with " + url)
                                // Add the tracks to the queue
                            ];
                        playlist = result.playlist;
                        return [4 /*yield*/, queue.addTracks(result.tracks)];
                    case 8:
                        _b.sent();
                        embed
                            .setDescription("**" + result.tracks.length + " songs from [" + playlist.title + "](" + playlist.url + ")** have been added to the Queue")
                            .setThumbnail(playlist.thumbnail);
                        return [3 /*break*/, 12];
                    case 9:
                        if (!(interaction.options.getSubcommand() === "search")) return [3 /*break*/, 12];
                        url = interaction.options.getString("searchterms");
                        return [4 /*yield*/, client.player.search(url, {
                                requestedBy: interaction.user,
                                searchEngine: discord_player_1.QueryType.AUTO
                            })
                            // finish if no tracks were found
                        ];
                    case 10:
                        result = _b.sent();
                        // finish if no tracks were found
                        if (result.tracks.length === 0)
                            return [2 /*return*/, interaction.editReply("No results")
                                // Add the track to the queue
                            ];
                        song = result.tracks[0];
                        return [4 /*yield*/, queue.addTrack(song)];
                    case 11:
                        _b.sent();
                        embed
                            .setDescription("**[" + song.title + "](" + song.url + ")** has been added to the Queue")
                            .setThumbnail(song.thumbnail)
                            .setFooter({ text: "Duration: " + song.duration });
                        _b.label = 12;
                    case 12:
                        if (!!queue.playing) return [3 /*break*/, 14];
                        return [4 /*yield*/, queue.play()
                            // Respond with the embed containing information about the player
                        ];
                    case 13:
                        _b.sent();
                        _b.label = 14;
                    case 14: 
                    // Respond with the embed containing information about the player
                    return [4 /*yield*/, interaction.reply({
                            embeds: [embed]
                        })];
                    case 15:
                        // Respond with the embed containing information about the player
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
