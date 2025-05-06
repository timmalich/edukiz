# simple educational games for kids

The project is WIP. I only got a couple of _hours_ in the next month. Will see how far I can push this...
Project _coding_ language is english.
Anyway: As long as no native english speaker can contribute to this project, I am only able to provide german sounds.
Soon I may add chinese as well...

## Objective

Simple HTML/JS educational games for children

## Boundaries

- Code should be as simple as possible, so it's easy for everyone to extend
- Must run offline (e.g. by simply copying to a smartphone, tablet, raspberry pi, laptop, ...)

## Available Games
This section shows a list of implemented Games, for planned Games see Project Page Issues. 

### Memory
Memory Games with:
- Letters and numbers
- Animals
Alphabetic Games with:
- Drag and Drop letters on letters
- Drag letters to a word
Arithmetic Games:
- Calculations with +- for equations with solutions between 0 and 18
Other Games:
- Text to speech. Provide a text and let the computer read it out loud. Uses the Web Speech API. This currently might not function well on all browsers. Furthermore, it definitely has some room for improvements.

## Project setup
### Framework decision
This project uses vue now.
Why? 

- After the first super simple game, I realized that it's way more pain in the a* than expected to do everything vanilla.  
- Vue is completely new for me, but even with my pretty limited web ui experience, I felt quite comfortable with it after only about 3 hours of practice. 
- I also considered Angular, but even though I did make small PoC apps with it, it felt more complicated. 
- React seems to be a bit more complicated. At least for me after reading the first tutorial.   
- OpenUi5 suites games not really well. It's rather made for enterprise applications with tables, diagrams and formulars.
- ... Another one from the thousands of frameworks I didn't even google, because there are just too many.   

### Setup
1. Clone the repository
2. Install npm:
[npm](https://www.npmjs.com/get-npm)
3. Install nvm [nvm](https://github.com/nvm-sh/nvm)
4. run `nvm install 16; nvm use 16`
5. run `npm install`

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
nvm use 16; npm run build
```

### Lints and fixes files

```
npm run lint
```

### Formate code:
```
npm run prettier
```

### Release
Run: `npm run tag-deployment`

### Distribute
For some reason it's currently almost impossible to get a free and valid SSL certificate for the current webhoster (see distribute old).
Therefore, I simply decided to a github page again to distribute the content. 
But: This made the repository unnecessary huge and was horrible to maintain.
Therefore, I just created a second repository https://github.com/timmalich/edukiz_live. 

To distribute: 
- clone the other repository too
- Name it edukiz_live
- put it next to this repository
- run: `nvm use 16; npm run deploy-github`

### Distribute (deprecated but still alive)
I'm just using the first recommended free webhoster for distribution. 
Previously I just put the 'dist' folder on a separate github branch and distributed it directly as github page.
But: This makes the repository unnecessary huge and is horrible to maintain.
If you want to contribute you may just contact me for the transcrypted ftp password.

#### install transcrypt
    git clone https://github.com/elasticdog/transcrypt.git
    cd transcrypt/
    #Linux:
    sudo ln -s ${PWD}/transcrypt /usr/local/bin/transcrypt
    
#### initialize transcrypt for this repo once by:
    cd /c/dev/git-repos/runtime-api
    transcrypt -c aes-256-cbc -p 'ThePassword' 

#### install ncftp
    sudo apt-get install ncftp
    
#### Distribute
    ./scripts/distribute.sh 

## Feature TODOs
