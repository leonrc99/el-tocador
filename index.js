const Discord = require('discord.js');
const ydtl = require('ytdl-core')
const auth = require('./auth.json');
const client = new Discord.Client();
const token = auth.token;

const prefix = '..'
const servers = {
    "server": {
        connection: null,
        dispatcher: null
    }
}

client.on('ready', () => {
    console.log(`Estou online!`)
})

client.on('message', async (msg) => {

    //filtros
    if(!msg.guild) return;    
    if(!msg.content.startsWith(prefix)) return;
    if(!msg.member.voice.channel){
        msg.channel.send('Você precisa estar conectado em um canal de voz para utilizar este comando!');
        return;
    }

    //comandos
    if(msg.content === prefix + 'join'){
        servers.server.connection = await msg.member.voice.channel.join();
    }

    if(msg.content === prefix + 'quit'){
        msg.member.voice.channel.leave();
        servers.server.connection = null;
        servers.server.dispatcher = null;
    }

    if (msg.content.startsWith(prefix + 'play')) {
        let playMusic = msg.content.slice(6);

        if(ydtl.validateURL(playMusic)){

            servers.server.dispatcher = servers.server.connection.play(ydtl(playMusic));            
        } else {
            msg.channel.send('Música inválida')
        }

    }

    if(msg.content === prefix + 'pause'){
        servers.server.dispatcher.pause();
    }

    if(msg.content === prefix + 'resume'){
        servers.server.dispatcher.resume();
    }

})

client.login(token);