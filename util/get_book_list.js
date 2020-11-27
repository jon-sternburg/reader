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


app.on('listening',(() => update_books()))

let top_100 = require('./top_100_new.json')


async function update_books() {

let new_arr=  top_100.map( x => {
let id = x.url.replace('https://www.gutenberg.org/ebooks/', '')
let filename = `/files/${id}.epub`
let new_obj = {...x, path: filename, id: id }

return new_obj
})

let str = JSON.stringify(new_arr)
let fp = './update_books.json'
await fsp.writeFile(fp, str)
console.log('done')



}

const fetchPromise = async (url) =>  fetch(url);




function removeDuplicatesFun( arr, prop ) {
  let obj = {};
  return Object.keys(arr.reduce((prev, next) => {
    if(!obj[next[prop]]) obj[next[prop]] = next; 
    return obj;
  }, obj)).map((i) => obj[i]);
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

