
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





<motion.aside
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
{props.sidebar == 'toc' && (<button type = {"button"}  className = {styles.toc_icon_active}  ><FaListOl  className = {styles.toc} /></button>)}
{props.sidebar == 'settings' && (<button type = {"button"}  className = {styles.settings_icon} ><AiFillSetting  className = {styles.settings} /></button>)}
{props.sidebar == 'annotations' && (<button type = {"button"}  className = {styles.annotations_icon} ><FaStickyNote  className = {styles.annotations} /></button>)}
{props.sidebar == 'new_annotation' && (<button type = {"button"}  className = {styles.new_annotation_icon} ><BiCommentAdd  className = {styles.new_annotation} /></button>)}
{props.sidebar == 'mobile_search' && (<button type = {"button"}  className = {styles.new_annotation_icon} ><FaSearch  className = {styles.new_annotation} /></button>)}
</div>


<header className = {styles.sidebar_title}> <h5>{title}</h5>
{(props.sidebar == 'menu' || props.sidebar == 'mobile_search') && props.w <= 1000 && (<button type = {"button"}  className = {styles.toc_icon_back_mobile} onClick = {() => props.set_sidebar('menu')} ><MdClose className = {styles.toc} /></button>)}
{props.sidebar == 'search' && props.w <= 1000 && (<button type = {"button"}  className = {styles.toc_icon_back_mobile} onClick = {() => cancel_search()} ><MdClose className = {styles.toc} /></button>)}
{props.sidebar == 'settings'  && props.w <= 1000 && (<button type = {"button"}  className = {styles.toc_icon_back_mobile} onClick = {() => props.set_sidebar('menu')} ><IoIosArrowBack className = {styles.toc} /></button>)}
{props.sidebar == 'toc' && props.w <= 1000 && (<button type = {"button"}  className = {styles.toc_icon_back_mobile} onClick = {() => props.set_sidebar('menu')} ><IoIosArrowBack className = {styles.toc} /></button>)}
{props.sidebar == 'annotations'  && props.w <= 1000 && (<button type = {"button"}  className = {styles.toc_icon_back_mobile} onClick = {() => props.set_sidebar('menu')} ><IoIosArrowBack className = {styles.toc} /></button>)}
 </header> 


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
<section className = {styles.toc_items}>
{props.toc.map((x, i) => {
return <p key = {x.label + i} onClick = {() => props.set_location(x, i)}>{x.label}</p>
})}
</section>) }



{props.sidebar == 'menu' && (
<section className = {styles.settings_wrap}>
<div className = {styles.settings_option_mobile} onClick = {() => props.set_sidebar('toc')}>
<button type = {"button"} className = {styles.toc_icon_mobile}  ><FaListOl className = {styles.toc} />
</button>
<span>Table of Contents</span>
</div>
<div className = {styles.settings_option_mobile} onClick = {() => props.set_sidebar('settings')}>
<button type = {"button"} className = {styles.settings_icon_mobile} ><AiFillSetting className = {styles.settings} />
</button>Settings
</div>
<div className = {styles.settings_option_mobile} onClick = {() => annotations.length > 0 ? props.set_sidebar('annotations') : {} }>
<button type = {"button"} className = {annotations.length > 0 ? styles.annotations_icon_mobile : styles.annotations_icon_mobile_disabled} ><FaStickyNote />
</button>Annotations
</div>
<div className = {styles.settings_option_mobile} onClick = {() =>  props.set_sidebar('mobile_search') }>
<button type = {"button"} className = {styles.annotations_icon_mobile} ><FaSearch />
</button>Search Text
</div>


{props.results.length > 0 && (<div className = {styles.indicator_icon}  onClick = {() => props.set_sidebar('search')}><FaSearch className = {styles.indicator} /></div>)}
</section>

  )}
{props.sidebar == 'mobile_search' && (
<section className = {styles.mobile_search_frame}>
  {props.mobile_search}
</section>

  )}

{props.sidebar == 'settings' && (
<section className = {styles.settings_wrap}>

{props.w > 1000 && (
<div className = {styles.settings_option}>
<span className = {styles.setting_name}>Page layout</span>
<div className = {styles.options}>
<button type = {"button"} className = {props.spread =='none' ? styles["single_wrap"] + " " + styles["enabled"] : styles["single_wrap"] + " " + styles["disabled"]} onClick = {() => props.toggle_spread()}>
<CgFormatJustify className = {styles.single_page} />
</button>
<button type = {"button"} className = {props.spread =='auto' ? styles["single_wrap"] + " " + styles["enabled"] : styles["single_wrap"] + " " + styles["disabled"]} onClick = {() => props.toggle_spread()} >
<CgFormatJustify className = {styles.double_page} />
<CgFormatJustify className = {styles.double_page} />
</button>
</div>
</div>
)}
<div className = {styles.settings_option}>
<span className = {styles.setting_name}>Navigation</span>
<div className = {styles.options}>
<button type = {"button"} className = {props.flow !== 'paginated' ? styles["scroll_flow"] + " " + styles["enabled"] : styles["scroll_flow"] + " " + styles["disabled"]} onClick = {() => props.toggle_flow()}>
<GiMouse className = {styles.scroll_flow_icon} />
</button>
<button type = {"button"} className = {props.flow == 'paginated' ? styles["arrow_flow"] + " " + styles["enabled"] : styles["arrow_flow"] + " " + styles["disabled"]} onClick = {() => props.toggle_flow()}>
<CgArrowsH className = {styles.arrow_flow_icon} />
</button>
</div>
</div>

<div className = {styles.settings_option}>
<span className = {styles.setting_name}>Text Size</span>
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
</section>
  )}

{props.sidebar == 'annotations' && (
<section className = {styles.annotations_list_wrap}>
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
</section> )}


{props.sidebar == 'new_annotation' && (
<section  className = {styles.annotation_text_wrap}  >
<div className = {styles.annotation_title_wrap}>
<input ref = {props.input_ref} className = {styles.title_input_search} placeholder="Title..." name="annotation_title_search" type="text"  />
</div>
<div className = {styles.annotation_text_wrap_inner}>
<textarea ref = {props.textarea_ref} className = {styles.textarea_id} placeholder = {'Notes...'}  />
</div>
<div className = {styles.button_wrap}>
<div className = {styles.save} onClick ={() => props.save_annotation()}>Save</div>
<div className = {styles.cancel} onClick ={() => props.cancel_annotation()}>Cancel</div>
</div>
</section> )}

</motion.div>
</motion.aside>
</Fragment>

  )
}

function Sidebar_Icons(props) {

  return(
<div className ={styles.sidebar_icons}>
<button type = {"button"} className = {styles.toc_icon} onClick = {() => props.set_sidebar('toc')} ><FaListOl className = {styles.toc} /></button>
<button type = {"button"} className = {styles.settings_icon} onClick = {() => props.set_sidebar('settings')}><AiFillSetting className = {styles.settings} /></button>
<button type = {"button"} className = {props.annotations.length > 0 ? styles.annotations_icon : styles.annotations_icon_disabled} onClick = {() => props.annotations.length > 0 ? props.set_sidebar('annotations') : {} }><FaStickyNote  /></button>
{props.results.length > 0 && (<button type = {"button"} className = {styles.indicator_icon} className = {styles.search_icon} onClick = {() => props.set_sidebar('search')}><FaSearch className = {styles.indicator}  /></button>)}
</div>

)}


const Sidebar_Icons_Fixed = (props) => {
return(
<div className = {styles.sidebar_icons_fixed_col}>
{props.sidebar == null ?
<Sidebar_Icons results = {props.results} annotations = {props.annotations}set_sidebar = {props.set_sidebar} />
:
<Fragment>
<button type = {"button"}  className = {styles.close_sidebar_icon}  onClick = {() => props.sidebar == 'new_annotation' ? props.cancel_annotation() : props.set_sidebar(null)}>
<MdClose className = {styles.close_sidebar} />
</button>
<Fragment>
{props.sidebar =='search' && ( <button type = {"button"} className = {styles.trash_icon} onClick = {() => props.clear_input()}><IoMdTrash className = {styles.trash} /></button>)} 
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

<div className = {props.selected ? styles["result_li"] + " " + styles["selected"] : styles["result_li"]  }   >

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


<footer className = {styles.annotation_bottom_bar}>
<MdEdit className = {styles.edit_annotation} onClick = {() => props.edit_annotation(props.x, props.i)}/>
<IoMdTrash className = {styles.delete_annotation} onClick = {() => props.delete_annotation(props.x, props.i)} />


</footer>

</Fragment>

</Fragment>
</div>

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