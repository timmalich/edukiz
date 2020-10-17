# simple educational games for kids

The project is WIP. I only got a couple of _hours_ in the next month. Will see how far I can push this...
Project _coding_ language is english.
Anyway: As long as no native english speaker can contribute to this project, I am only able to provide german sounds.
Soon I may add chinese as well...

## Aim

Simple HTML/JS educational games for children

## Boundaries

- Code should be as simple as possible, so it's easy for everyone to extend
- Must run offline (e.g. by simply copying to a smartphone, tablet, raspberry pi, laptop, ...)

## Available Games
This section shows a list of implemented Games, for planned Games see Project Page Issues. 

### Memory
Memory Game with:
- Letters and numbers
- Animals

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
3. cd into the root folder and run `npm install`

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Formate code:
```
npm run prettier
```

### Distribute
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
