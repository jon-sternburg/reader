
import React, { Component, Fragment, useState, useEffect, useRef} from 'react'
import styles from '../book_box_styles.module.css'
import ePub from 'epubjs'
import { IoIosArrowBack } from "react-icons/io"
import { IoIosArrowForward } from "react-icons/io"
import {IoIosCreate} from "react-icons/io"
import {FaHighlighter} from "react-icons/fa"
import Sidebar from './Sidebar'
import Loading_Circle from './Loading_Circle'
import Top_Bar_Book from './Top_Bar_Book'
import Mobile_Search from './Mobile_Search'
import parse from 'html-react-parser';
import { motion, AnimatePresence  } from "framer-motion"
import {AiFillHome} from "react-icons/ai"
import {FaEllipsisV} from "react-icons/fa"
import apply_ref_styles from '../util/apply_ref_styles'
import getTimeStamp from '../util/getTimeStamp'
import { useRouter } from 'next/router'
var qs = require('qs');
const storage = global.localStorage || null;


export default function Book_Box(props) {
const router = useRouter()
const [spread, set_spread] = useState('auto')
const [text_size, set_text_size] = useState({ value: 'medium', label: 'Medium' })
const [flow, set_flow] = useState('paginated')
const [keyvalue, set_keyvalue] = useState('')
const [results, set_results] = useState([])
const [si, set_si] = useState(null)
const [sidebar, set_sidebar] = useState(null)
const [empty_results, set_empty_results] = useState(null)
const [loading, set_loading] = useState(true)
const [page, set_page] = useState(1)

const toc = useRef([]);
const editing = useRef(null);
const draft_cfi = useRef(null);
const book = useRef(null);
const rendition = useRef(null);
const prev_flow = useRef('paginated');
const search_highlights = useRef([]);
const prev_spread = useRef('auto');
const first_loc = useRef(null);

const textarea_ref = useRef();
const input_ref = useRef();
const annotation_icon_ref = useRef(); 
const highlight_icon_ref = useRef(); 
const annotation_ref = useRef();
const highlight_ref = useRef();       
const popup_ref = useRef();


useEffect(() => {

router.beforePopState((x) => {
  
if (x.as !== router.asPath && qs.parse(x.as).cfi) {
  rendition.current.display(qs.parse(x.as).cfi)
} else {
props.select_book(null)
}
        return true;
    });

    return () => {
        router.beforePopState(() => true);
    };
}, [router]); 




useEffect(() => {

book.current  = ePub(props.selected_book.path)
rendition.current= book.current.renderTo("area", {
      width: "100%",
      height: "100%",
      flow: 'paginated',
      manager: 'default',
      spread: 'auto'
    });


book.current.ready.then(function(){
let ls_data = localStorage.getItem(props.selected_book.id+'-annotations')

let a =  ls_data !== undefined && ls_data !== 'undefined' ? JSON.parse(ls_data) : []
if (a && a !== null && a.length > 0) {
a.map(x => rendition.current.annotations.add('highlight', x[1].cfiRange, {text: x[1].data.text, data: x[1].data.data, section: x[1].data.section, time: x[1].data.time, title: x[1].data.title },  {}))
}


if (props.query_cfi !== null) { 
first_loc.current = props.query_cfi
router.push( `/?book=${props.selected_book.id}&cfi=${props.query_cfi}`, `/?book=${props.selected_book.id}&cfi=${props.query_cfi}`, {shallow: true})
}





book.current.loaded.navigation.then((toc) => {


rendition.current.themes.default({ "*:hover": { "color": `black !important`}})

rendition.current.on("markClicked", function(cfiRange, data, contents) {
annotation_clicked(cfiRange, data)
})


rendition.current.on("selected", function(cfiRange, contents) {
contents.window.addEventListener('mousedown', (e) => {
  if (e.target.id == '' || e.target.id == undefined) { 
  popup_ref.current.style.visibility = 'hidden'
}
})

let selection =  contents.window.getSelection()
let text = selection.toString()
apply_ref_styles(popup_ref, highlight_ref, annotation_ref)

let annotation_icon_ref = annotation_ref.current.childNodes[0]
let highlight_icon_ref = highlight_ref.current.childNodes[0]
highlight_icon_ref.setAttribute("width", '1.4em'); 
highlight_icon_ref.setAttribute("height", '1.4em');
highlight_icon_ref.style.marginRight = '10px'
annotation_icon_ref.setAttribute("width", '1.6em');
annotation_icon_ref.setAttribute("height", '1.6em');
annotation_icon_ref.style.marginRight = '10px'
highlight_ref.current.onclick = (e) => handle_highlight(e, cfiRange, text, selection)
annotation_ref.current.onclick = (e) => handle_annotation(e, cfiRange, text, selection)
popup_ref.current.style.visibility = 'visible'

})
return toc
}).then((toc_) => {
 toc.current = toc_
set_loading(false)
}).catch(err => console.log(err))
}).catch(err => console.log(err))

return () => {

if (search_highlights.current && search_highlights.current.length > 0) {clear_input()}
  console.log('adding ', Object.entries(rendition.current.annotations._annotations), ' to local storage...')
localStorage.setItem(props.selected_book.id+'-annotations', JSON.stringify(Object.entries(rendition.current.annotations._annotations)));
localStorage.setItem(props.selected_book.id+'-locations', JSON.stringify(rendition.current.location));

}

 }, [])

useEffect(() => { if (rendition.current && !loading) { 
if (first_loc.current !== null) {  rendition.current.display(first_loc.current)} else {  rendition.current.display() }
}}, [loading])

useEffect(() => {
  if (rendition.current && spread !== prev_spread.current) { 
rendition.current.spread(spread)
rendition.current.resize()
}
}, [spread])

useEffect(() => {
    if (rendition.current && flow !== prev_flow.current) { 
rendition.current.flow(flow)
rendition.current.resize()
rendition.current.themes.default({ "*:hover": { "color": `black !important`}})

}
}, [flow])

useEffect(() => {
 if (empty_results) {
setTimeout(
    function() {
        set_empty_results(false);
    }
    .bind(this),
    2000
);
}}, [empty_results])



useEffect(() => {
if (sidebar == 'annotations' && si !== null) { 
document.getElementsByClassName("sidebar_styles_selected_title__OLqfZ").item(0).scrollIntoView({ behavior: "instant", block: "start" });
} else if (sidebar == 'new_annotation' && draft_cfi.current !== null && editing.current) {
update_text(draft_cfi.current)
}
}, [sidebar])



function toggle_flow() { 
prev_flow.current = flow
set_flow(flow == 'paginated' ? 'scrolled' : 'paginated')

} 

function toggle_spread() {
prev_spread.current = spread
set_spread(spread == 'auto' ? 'none' : 'auto')

}

function set_location(x, i) {
rendition.current.display(x.href)
set_url_loc()
set_sidebar(null)
}
function handle_set_text_size(x) {
set_text_size(x)
rendition.current.themes.default({ "p": { "font-size": `${x.label} !important`}})
rendition.current.resize()
}


function get_annotation(x, i) {
rendition.current.display(x[1].cfiRange)
set_url_loc()
set_si(i)
set_sidebar(null)
}


function annotation_cb(cfi, loc) {
draft_cfi.current = cfi
editing.current = false
set_sidebar('new_annotation')

}



function handle_highlight(e, cfiRange, text, selection) {
popup_ref.current.style.visibility = 'hidden'
rendition.current.annotations.add('highlight', cfiRange, {text}, () => {})
}

function handle_search_highlight(e, cfiRange, text, x) {
rendition.current.annotations.add('highlight', cfiRange, {text: text, data: `search for ${keyvalue}`}, handle_set_search_highlights(x))
}


function handle_set_search_highlights(x) { 
search_highlights.current = [...search_highlights.current, x]
} 


function handle_annotation(e, cfiRange, text, selection) {
let loc = rendition.current.currentLocation()
console.log(toc.current)
let matching = toc.current.toc.filter(y => y.href.slice(0, y.href.indexOf('#')) == loc.start.href)
let section_ = matching && matching[0] && matching[0].label ? matching[0].label : 'No chapter available'
rendition.current.annotations.add('highlight', cfiRange, {text: text, data: 'notes go here', section: section_, loc: loc},  annotation_cb(cfiRange, loc))
popup_ref.current.style.visibility = 'hidden'
}

function handle_set_sidebar(val) {
if (results && results.length > 0 && props.w < 1000) {set_sidebar('search') } else { sidebar == val ? set_sidebar(null)  : set_sidebar(val)}
}

function update_text(x) {
input_ref.current.value =  x[1].data.title
textarea_ref.current.value = x[1].data.data
 }


function edit_annotation(x, i) {
editing.current = true
draft_cfi.current = x
set_sidebar('new_annotation')
}

function delete_annotation(x, i) {
  console.log('deleting ', x, ' i=', i)
let annotations = Object.entries(rendition.current.annotations._annotations) 
return new Promise((resolve,reject) => {
resolve(rendition.current.annotations.remove(annotations[i][1].cfiRange, 'highlight'))
}).then(() => {
localStorage.setItem(props.selected_book.id+'-annotations', JSON.stringify(Object.entries(rendition.current.annotations._annotations)));
set_si(si == i ? null : i)
}).catch(err => console.log(err))
}

function cancel_annotation() {
if (!editing.current) {

return new Promise((resolve,reject) => {
resolve(rendition.current.annotations.remove(draft_cfi.current, 'highlight'))
}).then(() => {
localStorage.setItem(props.selected_book.id+'-annotations', JSON.stringify(Object.entries(rendition.current.annotations._annotations)));
set_sidebar(null)
}).catch(err => console.log(err))
} else {
textarea_ref.current.value = ''
input_ref.current.value = ''
set_sidebar('annotations')
editing.current = false
}
}



function annotation_clicked(cfiRange, contents) {

let annotations = Object.entries(rendition.current.annotations._annotations) 
let fi = annotations.map(x => x[1])
let matching = annotations.filter(x => x[1].cfiRange == cfiRange )
let i = fi.indexOf(matching[0][1])
set_sidebar('annotations')
set_si(i)



}


function save_annotation() {
let time = getTimeStamp()
let annotations = Object.entries(rendition.current.annotations._annotations) 

let dc_ = typeof(draft_cfi.current) == 'string' ? draft_cfi.current : draft_cfi.current[1].data.epubcfi


let matching = annotations.filter(x => x[1].data.epubcfi == dc_)
let text = matching[0][1].data.text
let cfi = matching[0][1].data.epubcfi
let section = matching[0][1].data.section
let f = matching[0][1]
let index = annotations.map(x => x[1]).indexOf(f)
return new Promise((resolve,reject) => {
resolve(matching[0][1].update({text: text, data: textarea_ref.current.value, title: input_ref.current.value,  section: section, time: time}))
}).then(() => {
localStorage.setItem(props.selected_book.id+'-annotations', JSON.stringify(Object.entries(rendition.current.annotations._annotations)));
set_sidebar('annotations')
set_si(index)
}).catch(err => console.log(err))


}



function set_url_loc() {
let loc_ = rendition.current.currentLocation()
router.push( `/?book=${props.selected_book.id}&cfi=${loc_.start.cfi}`, `/?book=${props.selected_book.id}&cfi=${loc_.start.cfi}`, {shallow: true})
}

function previous_page(e) {
e.preventDefault();
rendition.current.prev()
set_url_loc()
}


function next_page(e) {
e.preventDefault();
rendition.current.next() 
set_url_loc()
} 

function handleInputChange_text(keyvalue) {
if (keyvalue.length == 0) {clear_input()} else {set_keyvalue(keyvalue)}
}

function handle_text_submit(e) {
e.preventDefault();


if (book.current && book.current != null && keyvalue.length > 2) {
let results = []
Promise.all(book.current.spine.spineItems.map(async x => {
await x.load(book.current.load.bind(book.current))
.then(() => x.find(keyvalue))
.then((s) => {
if (s.length > 0) {results.push({s:s, x: x})}
})
})).catch(err => console.log(err))
.then(() => {
let res_ = results.map(x => {
let matching = toc.current.toc.filter(y => y.href.slice(0, y.href.indexOf('#')) == x.x.href)
let label = matching && matching[0] && matching[0].label ?  matching[0].label : ''
let toc_id = matching && matching[0] && matching[0].id ?  matching[0].id : ''
return {s: x.s, x: x.x, label: label, sd: toc_id}

})
let res = res_.sort((a,b) => a.sd.replace('np-', '') - b.sd.replace('np-', ''))
set_sidebar(res && res.length > 0 ? 'search' : null)
set_empty_results(res && res.length > 0 ? false : true)
set_results(res)
}).catch(err => console.log(err))
} }

function get_context(x, i, mobile) {
set_si(i)
rendition.current.display(x.cfi)
set_url_loc()
handle_search_highlight(null, x.cfi, x.excerpt, x)

if (mobile) {set_sidebar(null)}
}


function clear_input() {
console.log('fired clear_input')

let annotations = Object.entries(rendition.current.annotations._annotations) 

return Promise.all(annotations.map((x,i) => {
let cfi_ = x[1].cfiRange
let matching = search_highlights.current.filter(y => y.cfi == cfi_)
if (matching && matching.length > 0) {rendition.current.annotations.remove(cfi_, 'highlight')}
})).then(() => {
localStorage.setItem(props.selected_book.id+'-annotations', JSON.stringify(Object.entries(rendition.current.annotations._annotations)));
set_results([])
set_keyvalue('')
set_si(null)
set_sidebar(null)
search_highlights.current = []
})
}



const flag = empty_results && results.length == 0

return (

  <Fragment>

{!loading && (
<Fragment>
<div ref = {popup_ref} className = {styles.popup} onClick = {(e) => e.preventDefault()} >
<button type = {"button"} ref = {annotation_ref} >
<IoIosCreate  className = {styles.annotation_icon} />
<span>Annotation</span>
</button>
 <button type = {"button"} ref = {highlight_ref} >
<FaHighlighter className = {styles.highlight_icon} />
<span>Highlight</span>
</button>
</div>


{props.w <= 1000 && sidebar == null && ( 
<Fragment>
<footer className = {styles.bottom_bar_wrap}>
<IoIosArrowBack className = {styles.left_arrow_icon} onClick = {(e) => previous_page(e)} />
<AiFillHome className = {styles.home_mobile} onClick = {() => props.select_book(null)} />
<FaEllipsisV className = {styles.settings_mobile} onClick = {() => handle_set_sidebar('menu')} />
<IoIosArrowForward className = {styles.right_arrow_icon} onClick = {(e) => next_page(e)} />
</footer>
</Fragment>
  )}


<AnimatePresence>
{flag && (
<motion.div 
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
className = {styles.no_results}>
No results.  Try another search!
</motion.div>)}
</AnimatePresence>
</Fragment>
)}

{props.w > 1000 && ( 
<Top_Bar_Book
select_book = {props.select_book} 
selected_book = {props.selected_book}
clear_input = {clear_input}
results = {results}
keyvalue = {keyvalue}
handle_text_submit = {handle_text_submit}
handleInputChange_text = {handleInputChange_text}
w={props.w}
/>
)}

{rendition !== null &&(
<div  className = {styles.book_box_frame}  style = {{width: props.w <= 1000 ? props.w :  props.w - 80}} >

{sidebar !== null && props.w > 1000 && (<div className = {styles.book_tint}  onClick = {() => handle_set_sidebar(null)}/>)}

<Sidebar 
book_title = {props.selected_book.title}
sidebar = {sidebar} 
set_sidebar = {handle_set_sidebar}
book = {book}
toc = {toc.current.toc}
w={props.w}
mobile_search={
  <Mobile_Search
select_book = {props.select_book} 
selected_book = {props.selected_book}
clear_input = {clear_input}
results = {results}
keyvalue = {keyvalue}
handle_text_submit = {handle_text_submit}
handleInputChange_text = {handleInputChange_text}
w={props.w}
/>
}
textarea_ref = {textarea_ref}
input_ref = {input_ref}
rendition = {rendition.current}
get_context = {get_context}
toggle_flow = {toggle_flow}
toggle_spread = {toggle_spread}
set_text_size = {handle_set_text_size}
text_size = {text_size}
delete_annotation = {delete_annotation}
edit_annotation = {edit_annotation}
set_location = {set_location}
spread = {spread}
flow = {flow}
keyvalue = {keyvalue}
get_annotation = {get_annotation}
results = {results}
si = {si}
draft_cfi = {draft_cfi.current}
save_annotation = {save_annotation}
cancel_annotation = {cancel_annotation}
clear_input = {clear_input}
/>

{loading && (  <Loading_Circle />)}

<section  id = 'area'  className = {styles.book_box_inner_wrap}>

{props.w > 1000 && ( 
  <Fragment>
{sidebar == null && (<button type = {"button"} className = {styles.arrow_left_arrow_wrap} onClick = {(e) => previous_page(e)}><IoIosArrowBack className = {styles.left_arrow_icon} /></button>)}
<button type = {"button"} className ={styles.arrow_right_arrow_wrap}  onClick = {(e) => next_page(e)}><IoIosArrowForward className = {styles.right_arrow_icon} /></button>
</Fragment>)}

</section>
    </div>
   )}
    </Fragment>
  )}



