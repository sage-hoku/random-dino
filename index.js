require('dotenv').config();
const fs = require('fs');

const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const arr1 = [];
const arr2 = [];

function buildArraySync(arr, path) {
  try {
    const fileContent = fs.readFileSync(path, 'utf8').trim();

    // Split by comma or newline
    const values = fileContent.split(/,|\n/);

    // Filter out empty values
    const filteredValues = values.filter(value => value.trim() !== '');

    // Push each non-empty value to the array
    filteredValues.forEach((value) => {
      arr.push(value.trim());
    });

    return arr;
  } catch (error) {
    console.error(`Error reading CSV file: ${path}`);
    return null;
  }
}
  
  const getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
  };
  
  const getRandomElement = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };
  
  function remove(i, arr) {
    if (arr.length === 0) return;
    let temp = arr[arr.length - 1];
    arr[arr.length - 1] = arr[i];
    arr[i] = temp;
    arr.pop();
    return arr;
  }
  
  const saveToFileSync = function (arr, fileName) {
    // Check if both the array and the file are empty
    if (Array.isArray(arr) && arr.length === 0 && fs.existsSync(fileName) && fs.readFileSync(fileName, 'utf8').trim() === '') {
      console.log('Input array and file are both empty. Nothing to write.');
      return;
    }
  
    // Ensure arr is an array before using join
    if (!Array.isArray(arr)) {
      console.error('Input is not an array.');
      return;
    }

    const csvContent = arr.join(',');
  
    try {
      fs.writeFileSync(fileName, csvContent, 'utf8');
      console.log('CSV file has been successfully created:', fileName);
    } catch (err) {
      console.error('Error writing CSV file:', err);
    }
  };


  function syncCall() {
    const dinos = [];
    const adjs = [];
  
    try {
      buildArraySync(adjs, 'csv/adjectives.csv');
      buildArraySync(dinos, 'csv/dinos.csv');  
  
      const adjNumber = getRandomInt(adjs.length);
      const dinoNumber = getRandomInt(dinos.length);  
  
      const adjective = adjs[adjNumber];
      const dino = dinos[dinoNumber];  
      const resultString = `${adjective} ${dino}`;
      
      remove(adjNumber, adjs);
      remove(dinoNumber, dinos);
      
      saveToFileSync('csv/adjectives.csv');
      saveToFileSync('csv/dinos.csv');
      
      return resultString;
    } catch (error) {
      console.error(error);
    }
  }
  
  function syncTest() {
    const dinos = [];
    const adjs = [];
  
    try {
      buildArraySync(adjs, 'csv/adjectives.csv');
      buildArraySync(dinos, 'csv/dinos.csv');
  
      const adjNumber = getRandomInt(adjs.length);
      const dinoNumber = getRandomInt(dinos.length);
  
      const adjective = adjs[adjNumber];
      const dino = dinos[dinoNumber];
      
      console.log(adjective, dino);
      
      const resultString = `${adjective} ${dino}`;

      return resultString;
    } catch (error) {
      console.error(error);
    }
  }
client.on('ready', () => {
    console.log('bot is ready');
})

client.on('messageCreate', async (message) => {
    if (message.content === '!ping') {
        message.reply({
            content: 'pong',
        })
    }
    else if (message.content === '!quote') {
        let resp = await axios.get(`https://api.quotable.io/random`);
        const quote = resp.data.content;

        message.reply({
            content: quote,
        })
    }
    else if (message.content === '!dino') {
        console.log("getting a dino...");
        const dinosaur = syncCall();
        message.reply({
            content: 'Happy Friday! Here\'s your dino of the day: ||' + dinosaur + '||'
        })
    }
    else if (message.content === '!dinoTest') {
        console.log("getting a dino...");
        const dinosaur = syncTest();
        message.reply({
            content: '||' + dinosaur + '||'
        })
    }
})

client.login(process.env.DISCORD_BOT_ID);