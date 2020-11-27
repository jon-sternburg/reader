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
const axios = require('axios');
const epubGEN = require('epub-gen');
let app = http.createServer()
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const delay = require('delay');

const puppeteer = require('puppeteer');

app.on('listening',(() => edit_epub()))
//let txt_url = `http://www.gutenberg.org/files/${b.id}/${b.id}-0.txt`

let list = require('./book_list.json')
let counter = 0



async function edit_epub() {

let b = list[counter]

console.log('starting ', b.title)


let content = []


JSDOM.fromURL(`https://www.gutenberg.org/files/${b.id}/${b.id}-h/${b.id}-h.htm`, options)
.then(dom => {

let html = dom.serialize()

if (html.includes('<div class="chapter">') && html.includes('<!--end chapter-->')) {

let str = html.slice(html.indexOf('<div class="chapter">'), html.lastIndexOf('<!--end chapter-->'))
let chapter_chunks = str.split('<div class="chapter">')
let content = []

Promise.all(chapter_chunks.map((text, i) => {

return new Promise((resolve,reject) => {

let title_pre = text.slice(text.indexOf('<h2>'), text.indexOf('</h2>')).trim()
let title = title_pre.slice(title_pre.lastIndexOf('>') + 1)
let data = text.slice(text.indexOf('</h2>'), text.indexOf('</div><!--end chapter-->')).trim()
if (title && title.length > 0 && data && data.length > 0) {content.push({title: title,data: data});}
resolve()
}).catch(err => console.log(err))

})).then(() => {

  const options = {
  title: b.title,
  author: b.author,
  output: `C:/Users/stern/Desktop/reader/public/files/${b.id}_alt.epub`, //`./updated_files/${b.id}_alt.epub`,
  fonts: ['./PT_Serif/PTSerif-Regular.ttf'],
  content
};

    return new epubGEN(options).promise;
  }).catch(err => console.log(err))
.then(() => {

counter = counter + 1
get_next()

}).catch(err => console.log(err))

} else {
  console.log('no good = ', b.title)
counter = counter + 1
get_next()
}
}).catch(err => console.log(err))


}



async function get_next() {
await delay(5000).then(() => edit_epub())


}



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

