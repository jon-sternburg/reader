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


let app = http.createServer()


app.on('listening',(() => get_covers()))

let b = require('./book_list.json')

async function get_ebooks() {

b.map(async x => {
let url = x.url
await fetchPromise(url)
.then(async (response) => {
let id = x.id
let filename = `${id}.epub`
let nfp =  path.join(__dirname,'public', 'files', filename)
if (response.ok) {
 return streamPipeline(response.body, fs.createWriteStream(nfp));
} else {
  console.log(url)
}
}).catch(err => console.log(err));

})

}




async function get_covers() {

b.map(async x => {
let url = `https://www.gutenberg.org/cache/epub/${x.id}/pg${x.id}.cover.medium.jpg`
await fetchPromise(url)
.then(async (response) => {
let filename = `${x.id}.jpg`
let nfp =  path.join(__dirname,'public', 'covers', filename)
if (response.ok) {
 return streamPipeline(response.body, fs.createWriteStream(nfp));
} else {
  console.log(url)
}
}).catch(err => console.log(err));

})

}

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
        //  ok(JSON.parse(data))
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

