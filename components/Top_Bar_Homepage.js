

import React, { Component, Fragment, PureComponent} from 'react'
//import '../pages/css/top_bar.css'
import styles from '../top_bar_styles.module.css'
import { FaBookOpen } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import { AiFillSetting } from "react-icons/ai"
import _ from 'lodash'
import { MdClose } from "react-icons/md"
import parse from 'html-react-parser';
import ePub from 'epubjs'
import {EpubCFI} from 'epubjs'
import { AiOutlineLeft } from "react-icons/ai"
import { AiOutlineRight } from "react-icons/ai"
import { FaStickyNote } from "react-icons/fa"


//var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
let book_data = require('./update_books.json')

export default class Top_Bar_Homepage extends Component {
constructor(props) {
  super(props);
  this.state = { 
    keyvalue: '',
    value: '',
    results: [],
    el_range: null,
    el_cfi: null,
    si: null,
    mark_id: null,
    mark_count: 0

  };

this.input = React.createRef();

}



handleInputChange_text = keyvalue => this.setState({keyvalue: keyvalue})



handle_text_submit = (e) => {
e.preventDefault();

 let book = this.props.book
 let keyvalue = this.state.keyvalue
 let rendition = this.props.rendition
let mark_count = this.state.mark_count
if (book && book != null && keyvalue.length > 2) {
let results = []
Promise.all(book.spine.spineItems.map(async x => {
await x.load(book.load.bind(book))
.then(async () => {
return await x.find(keyvalue)
})
.then((s) => {
if (s.length > 0) {
let obj = {s:s, x: x}
results.push(obj)
}
})
}))
.then(() => {
let c = results.flat().filter( x => x.s[0] && x.s[0].excerpt && x.s[0].excerpt.length > 0)

return Promise.all(c.map(x => {
let e = x.s[0].excerpt.replace(keyvalue, `<span id = 'hl'>${keyvalue}</span>`)
let e_html = `<span>${e}</span>`
let matching = this.props.toc.filter(y => y.href.slice(0, y.href.indexOf('#')) == x.x.href)

return new Promise((resolve,reject) => resolve(this.props.book.getRange(x.s[0].cfi)))
.then((range) => {

let el = range.endContainer.parentElement
el.id = `marked${mark_count}`
let obj = {
  original: x.s[0].excerpt, 
  excerpt: parse(e_html), 
  cfi: x.s[0].cfi, 
  href: x.x.href, 
  data: matching[0], 
  section: matching[0].label, 
  sd: matching[0].id,
  e_cfi: el
}
return obj
})}))
}).then((combined) => {
 
  rendition.themes.default({ [`#marked${mark_count}`]: { "background": `#FFFF00 !important`} ,"*:hover": { "color": `black !important`}   })
  this.setState({mark_id: `#marked${mark_count}`, mark_count: mark_count + 1, results: combined.sort((a,b) => a.sd.replace('np-', '') - b.sd.replace('np-', '')) })
})}}




record_el = (range, cfi, i) => this.setState({el_range: range, el_cfi: cfi, si: i})

get_context = async (x, i) => {
this.props.rendition.display(x.cfi)
}





close_results = () => {
this.props.rendition.themes.default({ [this.state.mark_id]: { "background": `none !important`}})
this.setState({results: [], keyvalue: '', si: null })
}

clear_input = () => this.setState({results: [], keyvalue: '', si: null})


handleInputChange = (keyvalue) => {
this.setState({keyvalue: keyvalue})
this.handleSearchChange()
  };


  handleSearchChange = (e) => {
    setTimeout(() => {
      if (this.state.keyvalue.length < 1) 
        this.setState({keyvalue: '', results: []})


    const re = new RegExp(_.escapeRegExp(this.state.keyvalue), "i");
    const isMatch_title = (result) => re.test(result.title);
    const isMatch_author = (result) => re.test(result.author)

    let _source = book_data
    let results_title = _.filter(_source, isMatch_title)
    let results_author = _.filter(_source, isMatch_author)
    let results = results_title.concat(results_author)

if (this.state.keyvalue.length > 2) {

this.setState({results: results})
}}, 500);
    
}







  render() {
let title = this.props.selected_book == null ? 'Reader' : this.props.selected_book.title

    return <div className = {styles.top_bar_frame}>


<div className = {styles.title_wrap}>
    <div className = {styles.book_icon_wrap} onClick = {() => this.props.select_book(null)}>
    <FaBookOpen id = {styles.book_icon} />
    </div>
    <div id = {styles.title} onClick = {() => this.props.select_book(null)}>{title}</div>
   </div>

{this.props.selected_book !== null && (
<div id = {styles.home_button} onClick = {() => this.props.select_book(null)}> <AiFillHome id = {styles.home} /></div> )}


{this.state.results.length > 0    ?

<Fragment>
{this.props.selected_book == null ? 
<ul className = {styles.search_results_homepage}>
{this.state.results.map((x, i) => {
return <li key = {x + i} onClick = {() => this.props.select_book(x)}>
<span id = {styles.res_title}>{x.title}</span>,
<span id = {styles.res_author}> {x.author}</span>
</li>
})}
</ul>
: null }
</Fragment>
:  null}




<div className = {styles.header_wrap}>

{this.props.w > 1000 && (
<div className = {styles.topbar_search_wrap}>
<form  onSubmit={(e) => e.preventDefault()}  role="search">
    <input 
    id="search_input_homepage" 
    type="search" 
    placeholder="Search books..." 
    value={this.state.keyvalue}
    onChange={(e) => this.handleInputChange(e.target.value)}
    />
</form>
</div>

)}





   











  </div>

    </div>
  }
}

const Result_Text = (kv, arr) => {


return arr.map((x,i) => {
return <li key = {i}>{x}<span id ='hl'>{kv}</span></li>



})
}