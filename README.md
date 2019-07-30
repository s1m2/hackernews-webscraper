# hackernews-webscraper
This is a web scraper for hackernews website implemented in nodejs

## Installation Process
To be able to run the command below you need to have installed nodejs on the device you are using. If you don't have nodejs installed on your machine you can download it from the link below.

[Node.js Download](https://nodejs.org/en/)

Then change directory into this project's directory and run the following command

```
npm run hackernews-install

```
## Running the app
Once you have managed to install all the dependencies while in the current directory run the following command.

```
hackernews --posts [n]

```

Where n is a positive integer between 1 and 100. This will be able to log the number of post(s) you input to your console.

## NPM Libraries used
### Axios Library

This is an awesome library used to make http request and handle responses from nodejs with an easy to use syntax and api especially if you use async await.

[More Info](https://www.npmjs.com/package/axios) 

### Cheerio Library

This is another awesome library for transvering and manipulating markup. You simply parse the markup and you can be able to start your desired manipulations. It also uses familiar iQuery syntax.

[More Info](https://github.com/cheeriojs/cheerio)

### Commander Library

This specific library helps to ran the program from the command line and it allows to customize and specify cusom flags

[More Info](https://www.npmjs.com/package/commander)

## Run it on docker

This project also comes with a Dockerfile for those who wish to run it there.
It is based on node version 10.
To run it :-

1. Build it with 

```
docker build -t hackernews .

```

2. Run it with

```
docker run hackernews --posts n

```

Where n is the number of posts. It should log the results to your console.


