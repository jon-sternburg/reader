
import React, { Component, Fragment, useState} from 'react'
import styles from '../sidebar_styles.module.css'
import { motion  } from "framer-motion"
import {MdClose} from "react-icons/md"
import {BiCommentAdd} from "react-icons/bi"
import {FaSearch} from "react-icons/fa"
import {FaListOl} from "react-icons/fa"
import {FaStickyNote} from "react-icons/fa"
import { AiFillSetting } from "react-icons/ai"
import { IoMdTrash } from "react-icons/io"
import Select from 'react-select';
import { CgFormatJustify } from "react-icons/cg"
import {GiMouse} from "react-icons/gi"
import {CgArrowsH} from "react-icons/cg"
import {MdEdit} from "react-icons/md"
import { IoIosArrowBack } from "react-icons/io"

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



const text_size_options = [
  { value: 'x-large', label: 'X-Large' },
  { value: 'large', label: 'Large' },
  { value: 'medium', label: 'Medium' },
  { value: 'small', label: 'Small' }
]



export default function Sidebar(props){


 function cancel_search() {
props.set_sidebar('menu')
props.clear_input()
}



const SidebarVariants = {
 expanded: () => ({
   width: props.w <= 1000 ? '100vw'  : '50vw',
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
let sidebarCollapsed = props.sidebar == null

let annotations = props.rendition !== null ?  Object.entries(props.rendition.annotations._annotations) : []

let title = props.sidebar == 'toc' ? 'Contents' : 
			props.sidebar == 'settings' ? 'Settings' :
      props.sidebar == 'menu' ? 'Menu' :
      props.sidebar == 'mobile_search' ? 'Search' :
			props.sidebar == 'annotations' ? 'Annotations' :
			props.sidebar == 'search' ? `Search for '${props.keyvalue}'` : 
      props.sidebar == 'new_annotation' ? 'New Annotation' : null

    return (

    <Fragment>
{props.w > 1000 && (
<Sidebar_Icons_Fixed
set_sidebar = {props.set_sidebar}
cancel_annotation = {props.cancel_annotation}
results = {props.results}
sidebar = {props.sidebar}
annotations = {annotations}
clear_input = {props.clear_input}
 />
)}





<motion.div
initial={sidebarCollapsed ? "collapsed" : "expanded"}
animate={sidebarCollapsed ? "collapsed" : "expanded"}
variants={SidebarVariants}
className = {styles.sidebar_frame}>

<motion.div 
initial={sidebarCollapsed ? "collapsed" : "expanded"}
animate={sidebarCollapsed ? "collapsed" : "expanded"}
variants={contentVariants}
className = {styles.sidebar_inner_frame}>


<motion.div className = {styles.sidebar_header}>
<div className ={styles.sidebar_icons}>
{props.sidebar == 'toc' && (<div className = {styles.active_icon} id ={styles.toc_icon_active}  ><FaListOl className = {styles.active_icon} id = {styles.toc} /></div>)}
{props.sidebar == 'settings' && (<div className = {styles.active_icon} id = {styles.settings_icon} ><AiFillSetting className = {styles.active_icon} id = {styles.settings} /></div>)}
{props.sidebar == 'annotations' && (<div className = {styles.active_icon} id = {styles.annotations_icon} ><FaStickyNote className = {styles.active_icon} id = {styles.annotations} /></div>)}
{props.sidebar == 'new_annotation' && (<div className = {styles.active_icon} id = {styles.new_annotation_icon} ><BiCommentAdd className = {styles.active_icon} id = {styles.new_annotation} /></div>)}
{props.sidebar == 'mobile_search' && (<div className = {styles.active_icon} id = {styles.new_annotation_icon} ><FaSearch className = {styles.active_icon} id = {styles.new_annotation} /></div>)}
</div>


<div className = {styles.sidebar_title}> <span>{title}</span>
{(props.sidebar == 'menu' || props.sidebar == 'mobile_search') && props.w <= 1000 && (<div id ={styles.toc_icon_back_mobile} onClick = {() => props.set_sidebar('menu')} ><MdClose id = {styles.toc} /></div>)}
{props.sidebar == 'search' && props.w <= 1000 && (<div id ={styles.toc_icon_back_mobile} onClick = {() => cancel_search()} ><MdClose id = {styles.toc} /></div>)}
{props.sidebar == 'settings'  && props.w <= 1000 && (<div id ={styles.toc_icon_back_mobile} onClick = {() => props.set_sidebar('menu')} ><IoIosArrowBack id = {styles.toc} /></div>)}
{props.sidebar == 'toc' && props.w <= 1000 && (<div id ={styles.toc_icon_back_mobile} onClick = {() => props.set_sidebar('menu')} ><IoIosArrowBack id = {styles.toc} /></div>)}
{props.sidebar == 'annotations'  && props.w <= 1000 && (<div id ={styles.toc_icon_back_mobile} onClick = {() => props.set_sidebar('menu')} ><IoIosArrowBack id = {styles.toc} /></div>)}
 </div> 


{props.sidebar == 'search' && props.results.length > 0 && (
<div className = {styles.search_results_wrap_sidebar} >
{props.results.length > 0 && (

<div className = {styles.search_results_wrap_sidebar_inner}>
{props.results.map((x, i) => {

return <Search_Section_Result key = {i} w ={props.w} x={x} i={i} get_context = {props.get_context} />

})}
</div>
)}

</div>)}
</motion.div>



{props.sidebar == 'toc' && (
<div id = {styles.toc_items}>
{props.toc.map((x, i) => {
return <li key = {x.label + i} onClick = {() => props.set_location(x, i)}>{x.label}</li>
})}
</div>) }



{props.sidebar == 'menu' && (
<div className = {styles.settings_wrap}>
<div className = {styles.settings_option_mobile} onClick = {() => props.set_sidebar('toc')}>
<div id ={styles.toc_icon_mobile}  ><FaListOl id = {styles.toc} />
</div>
<span>Table of Contents</span>
</div>
<div className = {styles.settings_option_mobile} onClick = {() => props.set_sidebar('settings')}>
<div id = {styles.settings_icon_mobile} ><AiFillSetting id = {styles.settings} />
</div>Settings
</div>
<div className = {styles.settings_option_mobile} onClick = {() => annotations.length > 0 ? props.set_sidebar('annotations') : {} }>
<div id = {annotations.length > 0 ? styles.annotations_icon_mobile : styles.annotations_icon_mobile_disabled} ><FaStickyNote id = 'annotations' />
</div>Annotations
</div>
<div className = {styles.settings_option_mobile} onClick = {() =>  props.set_sidebar('mobile_search') }>
<div id = {styles.annotations_icon_mobile} ><FaSearch id = 'search' />
</div>Search Text
</div>


{props.results.length > 0 && (<div className = {styles.indicator_icon} id = {styles.search_icon} onClick = {() => props.set_sidebar('search')}><FaSearch className = {styles.indicator} id = 'search' /></div>)}
</div>

  )}
{props.sidebar == 'mobile_search' && (
<div className = {styles.mobile_search_frame}>
  {props.mobile_search}
</div>

  )}

{props.sidebar == 'settings' && (
<div className = {styles.settings_wrap}>

{props.w > 1000 && (
<div className = {styles.settings_option}>
<span id = {styles.setting_name}>Page layout</span>
<div id = {styles.options}>
<div className = {props.spread =='none' ? styles["single_wrap"] + " " + styles["enabled"] : styles["single_wrap"] + " " + styles["disabled"]} onClick = {() => props.toggle_spread()}>
<CgFormatJustify id = {styles.single_page} />
</div>
<div className = {props.spread =='auto' ? styles["single_wrap"] + " " + styles["enabled"] : styles["single_wrap"] + " " + styles["disabled"]} onClick = {() => props.toggle_spread()} >
<CgFormatJustify id = {styles.double_page} />
<CgFormatJustify id = {styles.double_page} />
</div>
</div>
</div>
)}
<div className = {styles.settings_option}>
<span id = {styles.setting_name}>Navigation</span>
<div id = {styles.options}>
<div className = {props.flow !== 'paginated' ? styles["scroll_flow"] + " " + styles["enabled"] : styles["scroll_flow"] + " " + styles["disabled"]} onClick = {() => props.toggle_flow()}>
<GiMouse id = {styles.scroll_flow_icon} />
</div>
<div className = {props.flow == 'paginated' ? styles["arrow_flow"] + " " + styles["enabled"] : styles["arrow_flow"] + " " + styles["disabled"]} onClick = {() => props.toggle_flow()}>
<CgArrowsH id ={styles.arrow_flow_icon} />
</div>
</div>
</div>

<div className = {styles.settings_option}>
<span id = {styles.setting_name}>Text Size</span>
<div className = {styles.dropdown_wrap}>
<Select
value={props.text_size}
onChange={props.set_text_size}
options={text_size_options}
placeholder = {props.text_size}
defaultValue = {text_size_options[2]}
isSearchable = {false}
styles = {customStyles}
      />
</div>
</div>
</div>
  )}

{props.sidebar == 'annotations' && (
<div className = {styles.annotations_list_wrap}>
{annotations.map((x, i) => {

let selected = props.si == i

return <Annotation 
key = {x + i} 
selected = {selected} 
x = {x} 
i = {i} 
get_annotation = {props.get_annotation} 
edit_annotation = {props.edit_annotation} 
delete_annotation = {props.delete_annotation} 
/>
})}
</div> )}


{props.sidebar == 'new_annotation' && (
<div  className = {styles.annotation_text_wrap}  >
<div className = {styles.annotation_title_wrap}>
<input ref = {props.input_ref} id = {styles.title_input_search} placeholder="Title..." name="annotation_title_search" type="text"  />
</div>
<div className = {styles.annotation_text_wrap_inner}>
<textarea ref = {props.textarea_ref} id = {styles.textarea_id} placeholder = {'Notes...'}  />
</div>
<div className = {styles.button_wrap}>
<div id = {styles.save} onClick ={() => props.save_annotation()}>Save</div>
<div id = {styles.cancel} onClick ={() => props.cancel_annotation()}>Cancel</div>
</div>
</div> )}

</motion.div>
</motion.div>
</Fragment>

  )
}

function Sidebar_Icons(props) {

  return(
<div className ={styles.sidebar_icons}>
<div id ={styles.toc_icon} onClick = {() => props.set_sidebar('toc')} ><FaListOl id = {styles.toc} /></div>
<div id = {styles.settings_icon} onClick = {() => props.set_sidebar('settings')}><AiFillSetting id = {styles.settings} /></div>
<div id = {props.annotations.length > 0 ? styles.annotations_icon : styles.annotations_icon_disabled} onClick = {() => props.annotations.length > 0 ? props.set_sidebar('annotations') : {} }><FaStickyNote id = 'annotations' /></div>
{props.results.length > 0 && (<div className = {styles.indicator_icon} id = {styles.search_icon} onClick = {() => props.set_sidebar('search')}><FaSearch className = {styles.indicator} id = 'search' /></div>)}
</div>

)}


const Sidebar_Icons_Fixed = (props) => {
return(
<div className = {styles.sidebar_icons_fixed_col}>
{props.sidebar == null ?
<Sidebar_Icons results = {props.results} annotations = {props.annotations}set_sidebar = {props.set_sidebar} />
:
<Fragment>
<div  id = {styles.close_sidebar_icon}  onClick = {() => props.sidebar == 'new_annotation' ? props.cancel_annotation() : props.set_sidebar(null)}>
<MdClose id = {styles.close_sidebar} />
</div>
<Fragment>
{props.sidebar =='search' && ( <div id = {styles.trash_icon} onClick = {() => props.clear_input()}><IoMdTrash id = {styles.trash} /></div>)} 
</Fragment>
</Fragment>
}
</div>
)}



function Annotation(props) {

 function element_clicked(s) {
  props.get_annotation(props.x, props.i)
  }

let selected = props.selected
let text = props.x[1].data.text
let notes = props.x[1].data.data
let cfi = props.x[1].data.epubcfi
let section = props.x[1].data.section
let time = props.x[1].data.time
let title = props.x[1].data.title
let preview = text//.substring(0, 200)
let notes_preview = notes? notes : ''
let title_ = title ? title : 'untitled'
  return (

<li className = {props.selected ? styles["result_li"] + " " + styles["selected"] : styles["result_li"]  }   >

<h3  className = {props.selected ? styles.selected_title: styles.not_selected_title }>{title_}</h3>


<Fragment>
{section && section.length > 0 && (
<p className = {styles.section}  style = {{fontStyle: 'italic'}}>{section}</p>
)}
<p onClick = {() => element_clicked(selected)} className= {styles.preview} style = {{fontStyle: 'italic'}}>...{preview}...</p>
<Fragment>
{notes_preview && notes_preview.length > 0 && (
<p className = {styles.annotation_notes} >{notes_preview}</p>
  )}


<div className = {styles.annotation_bottom_bar}>
<MdEdit id = {styles.edit_annotation} onClick = {() => props.edit_annotation(props.x, props.i)}/>
<IoMdTrash id = {styles.delete_annotation} onClick = {() => props.delete_annotation(props.x, props.i)} />


</div>

</Fragment>

</Fragment>
</li>

  );
}

function Search_Section_Result(props) {
const [open, set_open] = useState(props.i == 0 ? true : false)

function toggle_section() {
set_open(!open)
}


return (
<div className = {styles.search_result_section_wrap}>
<h4 onClick = {() => toggle_section()}>{`${props.x.s.length} results found in ${props.x.label}`}</h4>


{open && (

<div className = {styles.search_result_item}>
{props.x.s.map((y,i_) => {

return <p key = {i_} onClick = {() => props.get_context(y, i_, props.w < 1000)}>{y.excerpt}</p>

})}
</div>
  )}

</div>
)


  

}