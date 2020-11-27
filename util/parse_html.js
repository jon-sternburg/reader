var _ = require('lodash');
const express = require("express");
const fsp = require('fs').promises;
const fs = require('fs')
const path = require("path");
const request = require("request");
const { http, https } = require('follow-redirects');
const fetch = require('node-fetch');
var _ = require('lodash');
const util = require('util');
const streamPipeline = util.promisify(require('stream').pipeline);
const cheerio = require('cheerio');
const htmlparser2 = require("htmlparser2");
var HTMLParser = require('node-html-parser');
 


let app = http.createServer()


app.on('listening',(() => parse_html()))

let top_100 = require('./update_books.json')



async function parse_html() {



await readFilePromise_HTML(`./list.html`)
.then(async (html) => {

let test = HTMLParser.parse(html)

let boxes = test.childNodes


let children = []
boxes.map(box => {
if (box.childNodes.length > 0) {
children.push(box.childNodes[1])
}
})

let final = children.map(x => {
let id = x.rawAttrs.slice(x.rawAttrs.indexOf('href="/') + 6, x.rawAttrs.indexOf('" accesskey='))
let link = `https://www.gutenberg.org/ebooks${id}.epub.noimages`
let title = x.querySelector(".title") ? x.querySelector(".title").text : undefined
let author = x.querySelector(".subtitle") ? x.querySelector(".subtitle").text : undefined
let o = {title: title, author: author, url: link, id: id.replace('/ebooks/', ''), path: `/files/${id.replace('/ebooks/', '')}.epub`}

return o
})


let r = JSON.stringify(final)
let fp = './book_list.json'
await fsp.writeFile(fp, r)
}).catch(err => console.log(err))

 }

const parser = new htmlparser2.Parser({
    onopentag(name, attribs) {
        if (name === "script" && attribs.type === "text/javascript") {
            console.log("JS! Hooray!");
        }
    },
    ontext(text) {
        console.log("-->", text);
    },
    onclosetag(tagname) {
        if (tagname === "script") {
            console.log("That's it?!");
        }
    },
});

const fetchPromise = async (url) =>  fetch(url);



function removeDuplicatesFun( arr, prop ) {
  let obj = {};
  return Object.keys(arr.reduce((prev, next) => {
    if(!obj[next[prop]]) obj[next[prop]] = next; 
    return obj;
  }, obj)).map((i) => obj[i]);
}
var readFilePromise_HTML = function(file) {
  return new Promise(function(ok, notOk) {
    fs.readFile(file, function(err, data) {
        if (err) {
          ok([])
        } else {
          ok(data)

        }
    })
  })
}



var readFilePromise = function(file) {
  return new Promise(function(ok, notOk) {
    fs.readFile(file, function(err, data) {
        if (err) {
          ok([])
        } else {
          ok(JSON.parse(data))

        }
    })
  })
}
app.listen(1111, '127.0.0.1');

