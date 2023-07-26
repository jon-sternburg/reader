
import React, { Component, Fragment} from 'react'
import ReactDOM from 'react-dom'
import styles from '../book_box_styles.module.css'
import ePub from 'epubjs'
import {Annotation} from 'epubjs'
import { IoIosArrowBack } from "react-icons/io"
import { IoIosArrowForward } from "react-icons/io"
import { AiOutlineLeft } from "react-icons/ai"
import { AiFillSetting } from "react-icons/ai"
import { AiOutlineRight } from "react-icons/ai"
import Select from 'react-select';
import { BsBookHalf } from "react-icons/bs"
import { BsBook } from "react-icons/bs"
import { CgFormatJustify } from "react-icons/cg"
import {GiMouse} from "react-icons/gi"
import {CgArrowsH} from "react-icons/cg"
import {VscTextSize} from "react-icons/vsc"
import {MdClose} from "react-icons/md"
import {IoIosCreate} from "react-icons/io"
import {FaHighlighter} from "react-icons/fa"
import {FaListOl} from "react-icons/fa"
import {FaSearch} from "react-icons/fa"
import {FaStickyNote} from "react-icons/fa"
import Sidebar from './Sidebar'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Top_Bar_Book from './Top_Bar_Book'
import ReactHtmlParser from 'react-html-parser';
import { motion, AnimatePresence  } from "framer-motion"
import {AiFillHome} from "react-icons/ai"
import {FaEllipsisV} from "react-icons/fa"


const storage = global.localStorage || null;


const text_size_options = [
  { value: 'x-large', label: 'X-Large' },
  { value: 'large', label: 'Large' },
  { value: 'medium', label: 'Medium' },
  { value: 'small', label: 'Small' }
]


export default class Book_Box extends Component {
  constructor(props) {
    super(props);
    this.state =  {
          toc: [],
          show_toc: false,
          key: null,
          show_settings: false,
          spread: 'auto',
          width: this.props.w - 40,
          height: this.props.h,
          text_size: { value: 'medium', label: 'Medium' },
          keyvalue: '',
          value: '',
          results: [],
          el_range: null,
          el_cfi: null,
          si: null,
          mark_id: null,
          mark_count: 0,
          flow: 'paginated',
          annotations: null,
          show_note_popup: false,
          px: null,
          py: null,
          textAreaValue: '',
          inputValue: '',
          capture_text: false,
          draft_cfi: null,
          sidebar: null,
          draft_loc: null,
          book: null,
          rendition: null,
          empty_results: false,
          loading: true,
          editing: false,
          locations: [],
          page: 1
                  }
                
    this.note_window = React.createRef();
    this.textarea_ref = React.createRef();
    this.input_ref = React.createRef();
    this.annotation_span_ref = React.createRef();
    this.annotation_icon_ref = React.createRef(); 
    this.highlight_span_ref = React.createRef();
    this.highlight_icon_ref = React.createRef(); 
    this.annotation_ref = React.createRef();
    this.highlight_ref = React.createRef();       
    this.popup_ref = React.createRef();
    this.frame_ref = React.createRef();
    this.book_ref = React.createRef();


}



toggle_flow = () => this.setState({flow: this.state.flow == 'paginated' ? 'scrolled' : 'paginated'})
toggle_spread = () => this.setState({spread: this.state.spread == 'auto' ? 'none' : 'auto'})
toggle_toc = () => this.setState({show_toc: !this.state.show_toc})

set_location = (x, i) => {
  this.state.rendition.display(x.href)
  this.set_sidebar(null)
}

set_text_size = (x) => {
this.setState({text_size: x})
this.state.rendition.themes.default({ "p": { "font-size": `${x.label} !important`}})
this.state.rendition.resize()
}

handle_slider = (x) => {
let t = this.state.toc[this.state.page - 1]
this.setState({page: x, slide_section: t.label})
}

set_slider = () => {
let t = this.state.toc[this.state.page - 1]
this.state.rendition.display(t.href)

}


componentDidUpdate(prevProps, prevState) {

if (this.state.spread !== prevState.spread) {
this.state.rendition.spread(this.state.spread)
this.state.rendition.resize()
}

if (this.state.show_toc !== prevState.show_toc) {
this.state.rendition.resize()
}

if (this.state.flow !== prevState.flow) {
this.state.rendition.flow(this.state.flow)
this.state.rendition.resize()

}


if (this.state.empty_results && this.state.empty_results !== prevState.empty_results ) {
setTimeout(
    function() {
        this.setState({ empty_results: false });
    }
    .bind(this),
    2000
);
}}

get_annotation = (x, i) => {
let cfi = x[1].cfiRange
this.state.rendition.display(cfi)
console.log(i)
this.setState({si: i})
}



set_toc = (toc) => this.setState({ toc: toc.toc, toc_by_id: toc.tocById })

highlight_cb = (x) => console.log('highlighted passage')

annotation_cb = (cfi, loc) => this.setState({draft_cfi: cfi, sidebar: 'new_annotation', editing: false})



handle_highlight = (e, cfiRange, text, selection) => {
this.popup_ref.current.style.visibility = 'hidden'
this.state.rendition.annotations.add('highlight', cfiRange, {text}, this.highlight_cb())
}


handle_annotation = (e, cfiRange, text, selection) => {

let loc = this.state.rendition.currentLocation()
let matching = this.state.toc.filter(y => y.href.slice(0, y.href.indexOf('#')) == loc.start.href)
console.log(matching)

let section_ = matching && matching[0] && matching[0].label ? matching[0].label : 'No chapter available'

console.log(section_)
this.state.rendition.annotations.add('highlight', cfiRange, {text: text, data: 'notes go here', section: section_, loc: loc},  this.annotation_cb(cfiRange, loc))
this.popup_ref.current.style.visibility = 'hidden'


}

set_sidebar = (val) => {this.state.sidebar == val ? this.setState({sidebar: null}) : this.setState({sidebar: val}) }



async componentDidMount() {

let _book = ePub(this.props.selected_book.path)
let _rendition = _book.renderTo("area", {
      width: "100%",
      height: "100%",
      flow: 'paginated',
      manager: 'default',
      spread: 'auto'
    });

let popup_ref = this.popup_ref
let highlight_ref = this.highlight_ref
let handle_annotation = this.handle_annotation
let handle_highlight = this.handle_highlight
let annotation_ref = this.annotation_ref
let annotation_clicked = this.annotation_clicked

_book.ready.then(function(){
var metadata =  _book.package
var loc_key = _book.key()+'-locations';
var a_key = _book.key()+'-annotations';
let loc = JSON.parse(localStorage.getItem(loc_key))
let a = JSON.parse(localStorage.getItem(a_key))

if (a && a !== null) {
let arr = [...a]
a.map(x => {
let cfiRange = x[1].cfiRange
let text = x[1].data.text
let data = x[1].data.data
let time = x[1].data.time
let title = x[1].data.title
let section = x[1].data.section
_rendition.annotations.add('highlight', cfiRange, {text: text, data: data, section: section, time: time, title: title },  {})
})}

return loc !== null && loc ? loc.start.cfi : undefined
})
.then((set) => {

_book.loaded.navigation.then((toc) => {
this.set_toc(toc)
_rendition.themes.default({ "*:hover": { "color": `black !important`}})
if (set) {_rendition.display(set) } else {_rendition.display() }

this.setState({rendition: _rendition, book: _book, loading: false })
})})

_book.spine.hooks.content.register((document_, section) => {
let htmlCollection = document_.getElementsByTagName('a')
var a_tags = [...htmlCollection];
if (a_tags.length > 0) {
a_tags.map(tag => {
if (tag && tag.attributes && tag.attributes.title && tag.attributes.title.nodeValue && tag.attributes.title.nodeValue == 'linked image') {
const newItem = document.createElement('text');
newItem.innerHTML = tag.innerHTML
tag.parentNode.replaceChild(newItem, tag);}
})
}

})

_rendition.on("markClicked", function(cfiRange, data, contents) {
annotation_clicked(cfiRange, data)
})


_rendition.on("selected", function(cfiRange, contents) {


contents.window.addEventListener('mousedown', (e) => {
  if (e.target.id == '' || e.target.id == undefined) { 
  popup_ref.current.style.visibility = 'hidden'
}
})


let selection =  contents.window.getSelection()
let text = selection.toString()
//selection.extentNode.after(popup_ref.current); 
//selection.extentNode.parentElement.insertAdjacentElement("beforebegin", popup_ref.current); 

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


 }


update_text = (x, i) => {
this.input_ref.current.value =  x[1].data.title
this.textarea_ref.current.value = x[1].data.data
 }


edit_annotation = (x, i) => {
let _cfi =  x[1].data.epubcfi
let annotations = Object.entries(this.state.rendition.annotations._annotations) 
let matching = annotations.filter(x => x[1].data.epubcfi == _cfi)
this.setState({sidebar: 'new_annotation', draft_cfi: _cfi, si: i, editing: true}, () => this.update_text(x, i));
}

delete_annotation = (x, i) => {
let annotations = Object.entries(this.state.rendition.annotations._annotations) 
let cfi = annotations[i][1].cfiRange
this.state.rendition.annotations.remove(cfi, 'highlight')
}
cancel_annotation = () => {
console.log('editing: ', this.state.editing)
if (!this.state.editing) {
this.state.rendition.annotations.remove(this.state.draft_cfi, 'highlight')
console.log(this.state.rendition.annotations)
this.setState({sidebar: null})
} else {
this.textarea_ref.current.value = ''
this.input_ref.current.value = ''
this.setState({sidebar: 'annotations', editing: false})
}}


annotation_clicked = (cfiRange, contents) => {
let annotations = Object.entries(this.state.rendition.annotations._annotations) 
let fi = annotations.map(x => x[1])
let matching = annotations.filter(x => x[1].cfiRange == cfiRange )
let i = fi.indexOf(matching[0][1])
this.setState({sidebar: 'annotations', si: i},() => {

let y = document.getElementsByClassName("sidebar_styles_selected_title__OLqfZ").item(0)
      setTimeout(function () {
           y.scrollIntoView({
               behavior: "smooth",
               block: "start",
           });
      }, 300);

});


}


save_annotation = () => {
let time = getTimeStamp()
let annotations = Object.entries(this.state.rendition.annotations._annotations) 
let matching = annotations.filter(x => x[1].data.epubcfi == this.state.draft_cfi)
let text = matching[0][1].data.text
let cfi = matching[0][1].data.epubcfi
let section = matching[0][1].data.section
let f = matching[0][1]
let index = annotations.map(x => x[1]).indexOf(f)
matching[0][1].update({text: text, data: this.textarea_ref.current.value, title: this.input_ref.current.value,  section: section, time: time})
console.log('saving new annotation')
this.setState({sidebar: 'annotations', si: index})
}

componentWillUnmount() {

let a = JSON.stringify(Object.entries(this.state.rendition.annotations._annotations)) //
let loc = JSON.stringify(this.state.rendition.currentLocation())

localStorage.setItem(this.state.book.key()+'-locations', loc);
localStorage.setItem(this.state.book.key()+'-annotations', a);
//this.state.rendition.destroy()
}

previous_page = (e) => {
  e.preventDefault();
  this.state.rendition.prev()
}
next_page = (e) => {
e.preventDefault();
 this.state.rendition.next() 
} 


handleInputChange_text = keyvalue => {

if (keyvalue.length == 0) {
this.state.results.map(x => {
x.e_cfi.id = ''
})
this.setState({keyvalue: keyvalue, sidebar: null, results: [], si: null})
this.state.rendition.themes.default({ [this.state.mark_id]: { "background": `none !important`}})
} else {

  this.setState({keyvalue: keyvalue})
}

}



handle_text_submit = (e) => {
e.preventDefault();

let book = this.state.book
let keyvalue = this.state.keyvalue
let rendition = this.state.rendition
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
let matching = this.state.toc.filter(y => y.href.slice(0, y.href.indexOf('#')) == x.x.href)

return new Promise((resolve,reject) => resolve(this.state.book.getRange(x.s[0].cfi)))
.then((range) => {

let el = range.endContainer.parentElement
el.id = `marked${mark_count}`

let obj = {
  original: x.s[0].excerpt, 
  excerpt: ReactHtmlParser(e_html), 
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
let res = combined.sort((a,b) => a.sd.replace('np-', '') - b.sd.replace('np-', ''))
  this.setState({
    sidebar: res && res.length > 0 ? 'search' : null,
    empty_results:  res && res.length > 0 ? false : true,
    mark_id: `#marked${mark_count}`, 
    mark_count: mark_count + 1, 
    results: res })
})}}

get_context = async (x, i) => {

console.log(x)
let el = x.e_cfi
this.setState({si: i})
this.state.rendition.display(x.cfi)  
}


clear_input = () => {
this.state.results.map(x => {
x.e_cfi.id = ''
})

  this.setState({results: [], keyvalue: '', si: null, sidebar: null})
  this.state.rendition.themes.default({ [this.state.mark_id]: { "background": `none !important`}})
}

  render() {
let slider_styles = {color: "whitesmoke"}
let annotations = this.state.rendition !== null ?  Object.entries(this.state.rendition.annotations._annotations) : []
let flag = this.state.empty_results && this.state.results.length == 0
return <div>

<div ref = {this.popup_ref} id = {styles.popup} onClick = {(e) => e.preventDefault()} >
<div ref = {this.annotation_ref} id ='annotation' >
<IoIosCreate  id = {styles.annotation_icon} />
Annotation
</div>
 <div ref = {this.highlight_ref} id='highlight' >
<FaHighlighter id = {styles.highlight_icon} />
Highlight
</div>
</div>


{this.props.w <= 1000 && this.state.sidebar == null && ( 
<Fragment>
<div className = {styles.bottom_bar_wrap}>
<IoIosArrowBack id = {styles.left_arrow_icon} onClick = {(e) => this.previous_page(e)} />

<AiFillHome id = {styles.home_mobile} onClick = {() => this.props.select_book(null)} />
<FaEllipsisV id = {styles.settings_mobile} onClick = {() => this.set_sidebar('menu')} />
<IoIosArrowForward id = {styles.right_arrow_icon} onClick = {(e) => this.next_page(e)} />
</div>
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


{this.props.w > 1000 && ( 
<Top_Bar_Book
rendition = {this.state.rendition}
toggle_settings = {this.toggle_settings} 
book = {this.state.book} 
select_book = {this.props.select_book} 
selected_book = {this.props.selected_book}
toc = {this.state.toc} 
toggle_notes = {this.toggle_notes}
show_notes = {this.state.show_notes}
clear_input = {this.clear_input}
results = {this.state.results}
keyvalue = {this.state.keyvalue}
handle_text_submit = {this.handle_text_submit}
handleInputChange_text = {this.handleInputChange_text}
si = {this.state.si}
w={this.props.w}
/>
)}


<div  className = {styles.book_box_frame} ref = {this.frame_ref}  style = {{width: this.props.w <= 1000 ? this.props.w :  this.props.w - 80}} >

{this.state.sidebar !== null && this.props.w > 1000 && (<div className = {styles.book_tint}  onClick = {() => this.set_sidebar(null)}/>)}

<Sidebar 
book_title = {this.props.selected_book.title}
sidebar = {this.state.sidebar} 
set_sidebar = {this.set_sidebar}
book = {this.state.book}
save_annotation_edit = {this.save_annotation_edit}
toc = {this.state.toc}
w={this.props.w}
textarea_ref = {this.textarea_ref}
input_ref = {this.input_ref}
rendition = {this.state.rendition}
get_context = {this.get_context}
toggle_flow = {this.toggle_flow}
toggle_spread = {this.toggle_spread}
set_text_size = {this.set_text_size}
text_size = {this.state.text_size}
delete_annotation = {this.delete_annotation}
edit_annotation = {this.edit_annotation}
set_location = {this.set_location}
spread = {this.state.spread}
flow = {this.state.flow}
get_annotation = {this.get_annotation}
results = {this.state.results}
si = {this.state.si}
draft_cfi = {this.state.draft_cfi}
save_annotation = {this.save_annotation}
cancel_annotation = {this.cancel_annotation}
clear_input = {this.clear_input}
/>

{this.state.loading && (  <div className = {styles.loading}><div className={styles.lds_default}>
  <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>)}

<div  id = 'area' ref = {this.book_ref}  className = {styles.book_box_inner_wrap}>





{this.props.w > 1000 && ( 
  <Fragment>
{this.state.sidebar == null && (<div className = {styles.arrow_left_arrow_wrap} onClick = {(e) => this.previous_page(e)}><IoIosArrowBack id = {styles.left_arrow_icon} /></div>)}
<div className ={styles.arrow_right_arrow_wrap}  onClick = {(e) => this.next_page(e)}><IoIosArrowForward id = {styles.right_arrow_icon} /></div>
</Fragment>)}

</div>



{this.props.w > 1000 && (
<div className = {styles.slider_wrap}>
<Slider 
defaultValue = {1}
value = {this.state.page}
min = {1}
max = {this.state.toc.length}
dots = {false}
onChange = {this.handle_slider}
onAfterChange = {this.set_slider}
    />
</div>
  )}
    </div>
    </div>
  }
}




function getTimeStamp() {
var now = new Date();
return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':'
+ ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now
.getSeconds()) : (now.getSeconds())));
}

function apply_ref_styles(popup_ref, highlight_ref, annotation_ref) {

popup_ref.current.style.position = 'absolute'
popup_ref.current.style.borderRadius = '12px'
popup_ref.current.style.backgroundColor = '#fff'
popup_ref.current.style.zIndex = '999999999999999999'
popup_ref.current.style.boxShadow = '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
popup_ref.current.style.display = 'flex'
popup_ref.current.style.flexDirection = 'row'
popup_ref.current.style.flexWrap = 'nowrap'
popup_ref.current.style.justifyContent = 'space-around'
popup_ref.current.style.userSelect = 'none'
highlight_ref.current.style.display = 'flex'
highlight_ref.current.style.borderLeft = '.5px solid lightgrey'
highlight_ref.current.style.padding = '10px'
highlight_ref.current.style.flexWrap = 'wrap'
highlight_ref.current.style.flexDirection = 'row'
highlight_ref.current.style.justifyContent = 'center'
highlight_ref.current.style.alignItems = 'center'
highlight_ref.current.style.cursor = 'pointer'
highlight_ref.current.style.borderTopRightRadius = '12px'
highlight_ref.current.style.borderBottomRightRadius = '12px'
highlight_ref.current.style.fontFamily = `'Open Sans', sans-serif`
highlight_ref.current.style.zIndex = '999999999999999999'
highlight_ref.current.style.userSelect = 'none'
annotation_ref.current.style.display = 'flex'
annotation_ref.current.style.borderRight = '.5px solid lightgrey'
annotation_ref.current.style.padding = '10px'
annotation_ref.current.style.flexWrap = 'wrap'
annotation_ref.current.style.flexDirection = 'row'
annotation_ref.current.style.justifyContent = 'center'
annotation_ref.current.style.alignItems = 'center'
annotation_ref.current.style.cursor = 'pointer'
annotation_ref.current.style.borderTopLeftRadius = '12px'
annotation_ref.current.style.borderBottomLeftRadius = '12px'
annotation_ref.current.style.fontFamily = `'Open Sans', sans-serif`
annotation_ref.current.style.zIndex = '999999999999999999'
annotation_ref.current.style.userSelect = 'none'
}