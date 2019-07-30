#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const program = require('commander');

/* 
    Find the maximum number of pages the posts can be located in.
    The maximum of posts located in a page is 30 e.g.
    if we want to get 60 posts we'll have to go through
    2 pages. 60/30 = 2
*/ 

const getPages = posts => Math.ceil(posts / 30);

/* 
    This methods performs a get request to a specified website
    it returns an object and the html is located on the data
    property.
*/ 

const getHTML = async uri => {
    try {
        let response = await axios.get(uri);
        let data = response.data;
        return data;
    } catch (error) {
        console.log(error);
    }  
}

/*
    This method accepts a url as a parameter and extracts the current page number.
*/

const getPageNumber = (url) => parseInt(url.match(/news\?p=(\d+)$/)[1]);

/* 
    This methods accepts the website url and the number of posts as parameters
    It then checks to see if the posts is a string or if does not lie between 1 and 100
    It then gets html from the first page and if the number of pages
    it then loops over while concatinating the html to the inital html varibale if the number of pages are more than 1
    It then returns all the html from all the pages and then calls the extractHTML method
*/

const getAllHTML = async (uri, posts) => {

    if (isNaN(posts)) {
        console.log('Posts should be a number');
        return 'Posts should be a number';
    }

    if (posts <= 0 || posts > 100 ) {
        console.log('Number of posts should be between 1 and 100');
        return 'Number of posts should be between 1 and 100';
    }

    let currentPageNumber = getPageNumber(uri);
    let pages = getPages(posts);
    let html = await getHTML(uri);
    
    while (currentPageNumber < pages) {
        const nextPageNumber = currentPageNumber + 1;
        const nextPage = `https://news.ycombinator.com/news?p=${nextPageNumber}`;
        html += await getHTML(nextPage);
        currentPageNumber += 1;
    }

    return extractHTML(html, posts);
}

/*
    The main function of this method is to extract the posts from the HTML
    It accepts two parameters html and the total number of posts
    I use cheerio js to transverse the html and extract post details
    Loop over the tables get the html details stop if the rank of post is equal to the required number of posts
*/

const extractHTML = (html, posts) => {

    const allPosts = [];
    let $ = cheerio.load(html);

    $('tr.athing').each((i, post) => {
        let title = $(post).find('td.title > a').text();
        let uri = $(post).find('td.title > a').attr('href');
        let rank = $(post).find('.rank').text();
        let author = $(post).next().find('.subtext > .hnuser').text();
        let points = $(post).next().find('.subtext > .score').text();
        let comments = $(post).next().find('.subtext > a:nth-child(6)').text();

        let obj = {
            title: stringChecker(title),
            uri: uriChecker(uri),
            author: stringChecker(author),
            points: pointsChecker(points),
            comments: pointsChecker(comments),
            rank: parseInt(rank)
        }

        if (obj.rank <= posts) {
            allPosts.push(obj);
        } 
    });

    console.log(allPosts);

    return allPosts;
}

/*
   This method checks if a title or author is available and that the character length is not greater than 256.
   If the character length is greater than 256 it shortens it and adds ... 
*/

const stringChecker = input => {
    let dot = "...";
    return (input.length > 0 && input.length < 256) ? input : input.substr(0, 256 - parseInt(dot.length))+dot;
}

/*
   This method checks if the uri is in a valid format
*/

const uriChecker = uri => {
    let regex = /((?<=\()[A-Za-z][A-Za-z0-9\+\.\-]*:([A-Za-z0-9\.\-_~:/\?#\[\]@!\$&'\(\)\*\+,;=]|%[A-Fa-f0-9]{2})+(?=\)))|([A-Za-z][A-Za-z0-9\+\.\-]*:([A-Za-z0-9\.\-_~:/\?#\[\]@!\$&'\(\)\*\+,;=]|%[A-Fa-f0-9]{2})+)/
    return regex.test(uri) ? uri : 'invalid uri';
}

/* 
    This method checks if the points are are greater available and they are greater than 0
*/

const pointsChecker = points => {
    return (points && parseInt(points) >= 0) ? parseInt(points) : 0;
}

/*
    This allows us to ran thr program from the cli and customize the flags we can use.
    It also captures the number of posts andd passes it to the getAllHTML function
*/

program
    .version('1.0.0')
    .option('-p, --posts', 'Enter number of posts')
    .action(input => {
        getAllHTML('https://news.ycombinator.com/news?p=1', parseInt(input))
    })


program.parse(process.argv)

module.exports = {
    getPages,
    getHTML,
    getPageNumber,
    extractHTML,
    getAllHTML,
    stringChecker,
    uriChecker,
    pointsChecker
}

