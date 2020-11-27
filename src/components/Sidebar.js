
import React, { Component, Fragment, useState, useEffect} from 'react'
import '../css/sidebar.css'
import { motion, AnimatePresence  } from "framer-motion"
import {MdClose} from "react-icons/md"
import ReactHtmlParser from 'react-html-parser';
import {BiCommentAdd} from "react-icons/bi"
import {FaSearch} from "react-icons/fa"
import {FaHighlighter} from "react-icons/fa"
import {FaListOl} from "react-icons/fa"
import {FaStickyNote} from "react-icons/fa"
import { AiFillSetting } from "react-icons/ai"
import { IoMdTrash } from "react-icons/io"
import Select from 'react-select';
import { CgFormatJustify } from "react-icons/cg"
import {GiMouse} from "react-icons/gi"
import {CgArrowsH} from "react-icons/cg"
import {MdExpandMore} from "react-icons/md"


import {MdEdit} from "react-icons/md"

var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
 const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: '#fff',
      borderColor: '#9e9e9e',
      minHeight: '30px',
      height: '30px',
      color: 'black',
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: '30px',
      padding: '0 6px'
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '30px',
    })
  };

const contentVariants = {
 expanded: () => ({
   opacity: 1,
           transition: {
      delay: .2
}
 }),
 collapsed: () => ({
   opacity: 0,

 })
}

const SidebarVariants = {
 expanded: () => ({
   width: w < 1000 ? '100vw'  : '20vw',
   transition: {

     width: { type: "keyframes", values: [0, 100, 0] }
   }
 }),
 collapsed: () => ({
   width: '0',
   transition: {

     width: { type: "keyframes", values: [0, 100, 0] }
   }
 })
};

const text_size_options = [
  { value: 'x-large', label: 'X-Large' },
  { value: 'large', label: 'Large' },
  { value: 'medium', label: 'Medium' },
  { value: 'small', label: 'Small' }
]



export default class Sidebar extends Component {


  render() {

let sidebarCollapsed = this.props.sidebar == null

let annotations = this.props.rendition !== null ?  Object.entries(this.props.rendition.annotations._annotations) : []

let title = this.props.sidebar == 'toc' ? 'Contents' : 
			this.props.sidebar == 'settings' ? 'Settings' :
			this.props.sidebar == 'annotations' ? 'Annotations' :
			this.props.sidebar == 'search' ? 'Search' : 
      this.props.sidebar == 'new_annotation' ? 'New Annotation' : null

    return <Fragment>
{w > 1000 && (
<Sidebar_Icons_Fixed
set_sidebar = {this.props.set_sidebar}
cancel_annotation = {this.props.cancel_annotation}
results = {this.props.results}
sidebar = {this.props.sidebar}
annotations = {annotations}
clear_input = {this.props.clear_input}
 />
)}





    <motion.div
        initial={sidebarCollapsed ? "collapsed" : "expanded"}
        animate={sidebarCollapsed ? "collapsed" : "expanded"}
        variants={SidebarVariants}
        className = 'sidebar_frame'
      >
<motion.div 
initial={sidebarCollapsed ? "collapsed" : "expanded"}
animate={sidebarCollapsed ? "collapsed" : "expanded"}
variants={contentVariants}
className = 'sidebar_inner_frame'>


<motion.div className = 'sidebar_header'>
<div className ='sidebar_icons'>
{this.props.sidebar == 'toc' && (<div className = 'active_icon' id ='toc_icon_active'  ><FaListOl className = 'active_icon' id = 'toc' /></div>)}
{this.props.sidebar == 'settings' && (<div className = 'active_icon' id = 'settings_icon' ><AiFillSetting className = 'active_icon' id = 'settings' /></div>)}
{this.props.sidebar == 'annotations' && (<div className = 'active_icon' id = 'annotations_icon' ><FaStickyNote className = 'active_icon' id = 'annotations' /></div>)}
{this.props.sidebar == 'new_annotation' && (<div className = 'active_icon' id = 'new_annotation_icon' ><BiCommentAdd className = 'active_icon' id = 'new_annotation' /></div>)}
</div>

<div className = 'sidebar_title'> <span>{title}</span> </div> 
{this.props.sidebar == 'search' && this.props.results.length > 0 && (
<div className = 'search_results_wrap_sidebar' role="search">
{this.props.results.length > 0 && (
<Fragment>
{this.props.results.map((x, i) => {
return <li className = {i == this.props.si ? 'search_li selected' : 'search_li' } key = {x + i} onClick = {() => this.props.get_context(x, i)}>
<span>{x.excerpt}</span><span>{x.section}</span></li>})}
</Fragment>)}
</div>)}




</motion.div>



{this.props.sidebar == 'toc' && (
<div id = 'toc_items'>
{this.props.toc.map((x, i) => {
return <li key = {x + i} onClick = {() => this.props.set_location(x, i)}>{x.label}</li>
})}
</div>) }



{this.props.sidebar == 'settings' && (
<div className = 'settings_wrap'>
<div className = 'settings_option first'>
<span id = 'setting_name'>Page layout</span>
<div id = 'options'>
<div className = {this.props.spread =='none' ? 'single_wrap enabled' : 'single_wrap disabled'} onClick = {() => this.props.toggle_spread()}>
<CgFormatJustify id = 'single_page' />
</div>
<div className = {this.props.spread =='auto' ? 'double_wrap enabled' : 'double_wrap disabled'} onClick = {() => this.props.toggle_spread()} >
<CgFormatJustify id = 'double_page' />
<CgFormatJustify id = 'double_page' />
</div>
</div>
</div>

<div className = 'settings_option'>
<span id = 'setting_name'>Navigation</span>
<div id = 'options'>
<div className = {this.props.flow !== 'paginated' ? 'scroll_flow enabled' : 'scroll_flow disabled'} onClick = {() => this.props.toggle_flow()}>
<GiMouse id = 'scroll_flow_icon' />
</div>
<div className = {this.props.flow == 'paginated' ? 'arrow_flow enabled' : 'arrow_flow disabled'} onClick = {() => this.props.toggle_flow()}>
<CgArrowsH id ='arrow_flow_icon' />
</div>
</div>
</div>

<div className = 'settings_option'>
<span id = 'setting_name'>Text Size</span>
<div className = 'dropdown_wrap'>
<Select
value={this.props.text_size}
onChange={this.props.set_text_size}
options={text_size_options}
placeholder = {this.props.text_size}
defaultValue = {text_size_options[2]}
isSearchable = {false}
styles = {customStyles}
      />
</div>
</div>
</div>
  )}

{this.props.sidebar == 'annotations' && (
<div className = 'annotations_list_wrap'>
{annotations.map((x, i) => {

let selected = this.props.si == i

return <Annotation 
key = {x + i} 
selected = {selected} 
x = {x} 
i = {i} 
get_annotation = {this.props.get_annotation} 
edit_annotation = {this.props.edit_annotation} 
delete_annotation = {this.props.delete_annotation} 
/>
})}
</div> )}


{this.props.sidebar == 'new_annotation' && (
<div  className = 'annotation_text_wrap'  >
<div className = 'annotation_title_wrap'>
<input ref = {this.props.input_ref} id = 'title_input_search' placeholder="Title..." name="annotation_title_search" type="text"  />
</div>
<div className = 'annotation_text_wrap_inner'>
<textarea ref = {this.props.textarea_ref} id = 'textarea_id' placeholder = {'Notes...'}  />
</div>
<div className = 'button_wrap'>
<div id = 'save' onClick ={() => this.props.save_annotation()}>Save</div>
<div id = 'cancel'onClick ={() => this.props.cancel_annotation()}>Cancel</div>
</div>
</div> )}

</motion.div>
</motion.div>
</Fragment>

  }
}

const Sidebar_Icons = (props) => {

  return(
<div className ='sidebar_icons'>
<div id ='toc_icon' onClick = {() => props.set_sidebar('toc')} ><FaListOl id = 'toc' /></div>
<div id = 'settings_icon' onClick = {() => props.set_sidebar('settings')}><AiFillSetting id = 'settings' /></div>
<div id = {props.annotations.length > 0 ? 'annotations_icon' : 'annotations_icon_disabled'} onClick = {() => props.annotations.length > 0 ? props.set_sidebar('annotations') : {} }><FaStickyNote id = 'annotations' /></div>
{props.results.length > 0 && (<div className = 'indicator_icon' id = 'search_icon' onClick = {() => props.set_sidebar('search')}><FaSearch className = 'indicator' id = 'search' /></div>)}
</div>

)}


const Sidebar_Icons_Fixed = (props) => {
return(
<div className = 'sidebar_icons_fixed_col'>
{props.sidebar == null ?
<Sidebar_Icons results = {props.results} annotations = {props.annotations}set_sidebar = {props.set_sidebar} />
:
<Fragment>
<div  id = 'close_sidebar_icon'  onClick = {() => props.sidebar == 'new_annotation' ? props.cancel_annotation() : props.set_sidebar(null)}>
<MdClose id = 'close_sidebar' />
</div>
<Fragment>
{props.sidebar =='search' && ( <div id = 'trash_icon' onClick = {() => props.clear_input()}><IoMdTrash id = 'trash' /></div>)} 
</Fragment>
</Fragment>
}
</div>
)}



function Annotation(props) {
  const [options, toggleOptions] = useState(false);


 function element_clicked() {
 // toggleOptions(!options)
  props.get_annotation(props.x, props.i)
  }

let selected = props.selected
let text = props.x[1].data.text
let notes = props.x[1].data.data
let cfi = props.x[1].data.epubcfi
let section = props.x[1].data.section
let time = props.x[1].data.time
let title = props.x[1].data.title
let preview = text.substring(0, 100)

  return (

<li className = {props.selected ? 'result_li selected' : 'result_li' } key = {props.x + props.i} onClick = {() => element_clicked()}>

<span id = 'annotation_title' >{title}</span>
<span id = 'preview' style = {{fontStyle: 'italic'}}>...{preview}...</span>

<Fragment>
{section && section.length > 0 && (
<span id = 'section'  style = {{fontStyle: 'italic'}}>{section}</span>
)}
{selected && (
<Fragment>
{notes && notes.length > 0 && (
<span id = 'annotation_notes' >{notes}</span>
  )}


<div className = 'annotation_bottom_bar'>
<MdEdit id = 'edit_annotation' onClick = {() => props.edit_annotation(props.x, props.i)}/>
<IoMdTrash id = 'delete_annotation' onClick = {() => props.delete_annotation(props.x, props.i)} />


</div>

</Fragment>
)}
</Fragment>
</li>

  );
}

