'use client'
import React, { Fragment } from 'react'
import styles from '../css/sidebar_styles.module.css'
import { motion } from "framer-motion"
import { BiCommentAdd } from "react-icons/bi"
import { FaSearch } from "react-icons/fa"
import { FaListOl } from "react-icons/fa"
import { FaStickyNote } from "react-icons/fa"
import { AiFillSetting, AiFillCloseCircle } from "react-icons/ai"
import Select, { StylesConfig } from 'react-select';
import { CgFormatJustify } from "react-icons/cg"
import { GiMouse } from "react-icons/gi"
import { CgArrowsH } from "react-icons/cg"
import { IoIosArrowBack } from "react-icons/io"
import { Annotation } from '../../../node_modules/epubjs/types/annotations'
import { NavItem, AnnotationData, RS_Option, S_Props } from '../types/sidebar_types'
import Sidebar_Icons_Fixed from './Sidebar_Icons_Fixed'
import Annotation_Wrapper from './Annotation_Wrapper'
import Search_Section_Result from './Search_Section_Result'



const text_size_options = [
  { value: 'x-large', label: 'X-Large' },
  { value: 'large', label: 'Large' },
  { value: 'medium', label: 'Medium' },
  { value: 'small', label: 'Small' }
]
const customStyles: StylesConfig<RS_Option, false> = {
  control: (provided) => ({
    ...provided,
    background: '#fff',
    borderColor: '#9e9e9e',
    minHeight: '30px',
    height: '30px',
    color: 'black'
  }),

  valueContainer: (provided) => ({
    ...provided,
    height: '30px',
    padding: '0 6px'
  }),
  indicatorsContainer: (provided) => ({
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





export default function Sidebar(props: S_Props) {
  const isAnnotationDataInner = (content: Annotation | AnnotationData | string): content is AnnotationData => typeof content !== 'string' && Array.isArray(content)
  const isNavItem = (content: NavItem | []): content is NavItem => 'label' in content

  function cancel_search() {
    props.set_sidebar('menu')
    props.clear_input()
  }



  const SidebarVariants = {
    expanded: () => ({
      width: props.w <= 1000 ? '100vw' : '50vw',
      transition: { width: { type: "keyframes", values: [0, 100, 0] } }
    }),
    collapsed: () => ({
      width: '0',
      transition: { width: { type: "keyframes", values: [0, 100, 0] } }
    })
  };

  let sidebarCollapsed = props.sidebar == null
  let annotations = props.rendition !== null ? props.rendition.annotations.each() : []

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
          set_sidebar={props.set_sidebar}
          cancel_annotation={props.cancel_annotation}
          results_length={props.results.length}
          sidebar={props.sidebar}
          annotations_length={annotations.length}
          clear_input={props.clear_input}
        />
      )}





      <motion.aside
        initial={sidebarCollapsed ? "collapsed" : "expanded"}
        animate={sidebarCollapsed ? "collapsed" : "expanded"}
        variants={SidebarVariants}
        className={styles.sidebar_frame}>

        <motion.div
          initial={sidebarCollapsed ? "collapsed" : "expanded"}
          animate={sidebarCollapsed ? "collapsed" : "expanded"}
          variants={contentVariants}
          className={styles.sidebar_inner_frame}>


          <motion.div className={styles.sidebar_header}>
            <div className={styles.sidebar_icons}>
              {props.sidebar == 'toc' && (<button type={"button"} className={styles.toc_icon_active}  ><FaListOl className={styles.toc} /></button>)}
              {props.sidebar == 'settings' && (<button type={"button"} className={styles.settings_icon} ><AiFillSetting className={styles.settings} /></button>)}
              {props.sidebar == 'annotations' && (<button type={"button"} className={styles.annotations_icon} ><FaStickyNote className={styles.annotations} /></button>)}
              {props.sidebar == 'new_annotation' && (<button type={"button"} className={styles.new_annotation_icon} ><BiCommentAdd className={styles.new_annotation} /></button>)}
              {props.sidebar == 'mobile_search' && (<button type={"button"} className={styles.new_annotation_icon} ><FaSearch className={styles.new_annotation} /></button>)}
            </div>


            <header className={styles.sidebar_title}> <h5>{title}</h5>
              {(
                props.sidebar == 'menu' ||
                props.sidebar == 'mobile_search')
                && props.w <= 1000 && (
                  <button type={"button"} className={styles.toc_icon_back_mobile} onClick={() => props.set_sidebar('menu')} ><AiFillCloseCircle className={styles.close_menu} /></button>
                )}

              {
                props.sidebar == 'search' && props.w <= 1000 && (
                  <button type={"button"} className={styles.toc_icon_back_mobile} onClick={() => cancel_search()} ><AiFillCloseCircle className={styles.toc} /></button>
                )}


              {(
                props.sidebar == 'settings' ||
                props.sidebar == 'toc' ||
                props.sidebar == 'annotations') && props.w <= 1000 && (
                  <button type={"button"} className={styles.toc_icon_back_mobile} onClick={() => props.set_sidebar('menu')} ><IoIosArrowBack className={styles.toc} /></button>
                )}

            </header>


            {props.sidebar == 'search' && props.results.length > 0 && (
              <div className={styles.search_results_wrap_sidebar} >
                {props.results.length > 0 && (

                  <div className={styles.search_results_wrap_sidebar_inner}>
                    {props.results.map((x, i) => {

                      return <Search_Section_Result key={i} w={props.w} x={x} i={i} get_context={props.get_context} keyvalue={props.keyvalue} />

                    })}
                  </div>
                )}

              </div>)}
          </motion.div>



          {props.sidebar == 'toc' && props.toc.length > 0 && (
            <section className={styles.toc_items}>
              {props.toc.map((x, i) => {
                let label_ = isNavItem(x) ? x.label : ''
                let href_ = isNavItem(x) ? x.href : ''
                return <p key={label_ + i} onClick={() => props.set_location(href_)}>{label_}</p>
              })}
            </section>)}



          {props.sidebar == 'menu' && (
            <section className={styles.settings_wrap}>

              <button type={"button"} className={styles.settings_option_mobile} onClick={() => props.set_sidebar('toc')}>
                <FaListOl className={styles.settings_mobile_icon} />
                <span>Table of Contents</span>
              </button>

              <button type={"button"} className={styles.settings_option_mobile} onClick={() => props.set_sidebar('settings')}>
                <AiFillSetting className={styles.settings_mobile_icon} />
                <span>Settings</span>
              </button>



              <button type={"button"} className={annotations.length > 0 ? styles.settings_option_mobile : styles.settings_option_mobile_disabled} onClick={() => annotations.length > 0 ? props.set_sidebar('annotations') : {}}>
                <FaStickyNote className={styles.settings_mobile_icon} />
                <span>Annotations</span>
              </button>

              <button type={"button"} className={styles.settings_option_mobile} onClick={() => props.set_sidebar('mobile_search')}>
                <FaSearch className={styles.settings_mobile_icon} />
                <span>Search Text</span>
              </button>


              {props.results.length > 0 && (<div className={styles.indicator_icon} onClick={() => props.set_sidebar('search')}><FaSearch className={styles.indicator} /></div>)}
            </section>

          )}
          {props.sidebar == 'mobile_search' && (
            <section className={styles.mobile_search_frame}>
              {props.mobile_search}
            </section>

          )}

          {props.sidebar == 'settings' && (
            <section className={styles.settings_wrap}>

              {props.w > 1000 && (
                <div className={styles.settings_option}>
                  <span className={styles.setting_name}>Page layout</span>
                  <div className={styles.options}>
                    <button type={"button"} className={props.spread == 'none' ? styles["single_wrap"] + " " + styles["enabled"] : styles["single_wrap"] + " " + styles["disabled"]} onClick={() => props.toggle_spread()}>
                      <CgFormatJustify className={styles.single_page} />
                    </button>
                    <button type={"button"} className={props.spread == 'auto' ? styles["single_wrap"] + " " + styles["enabled"] : styles["single_wrap"] + " " + styles["disabled"]} onClick={() => props.toggle_spread()} >
                      <CgFormatJustify className={styles.double_page} />
                      <CgFormatJustify className={styles.double_page} />
                    </button>
                  </div>
                </div>
              )}
              <div className={styles.settings_option}>
                <span className={styles.setting_name}>Navigation</span>
                <div className={styles.options}>
                  <button type={"button"} className={props.flow !== 'paginated' ? styles["scroll_flow"] + " " + styles["enabled"] : styles["scroll_flow"] + " " + styles["disabled"]} onClick={() => props.toggle_flow()}>
                    <GiMouse className={styles.scroll_flow_icon} />
                  </button>
                  <button type={"button"} className={props.flow == 'paginated' ? styles["arrow_flow"] + " " + styles["enabled"] : styles["arrow_flow"] + " " + styles["disabled"]} onClick={() => props.toggle_flow()}>
                    <CgArrowsH className={styles.arrow_flow_icon} />
                  </button>
                </div>
              </div>

              <div className={styles.settings_option}>
                <span className={styles.setting_name}>Text Size</span>
                <div className={styles.dropdown_wrap}>
                  <Select
                    value={props.text_size}
                    onChange={props.set_text_size}
                    options={text_size_options}
                    placeholder={props.text_size.label}
                    defaultValue={text_size_options[2]}
                    isSearchable={false}
                    styles={customStyles}
                  />
                </div>
              </div>
            </section>
          )}

          {props.sidebar == 'annotations' && (
            <section className={styles.annotations_list_wrap}>
              {annotations.map((x: any, i: number) => {

                let x_ = isAnnotationDataInner(x) && typeof x !== 'string' ? x : ''

                if (typeof x_ !== 'string') {
                  return <Annotation_Wrapper
                    key={i}
                    x={x_}
                    i={i}
                    selected={props.si == i}
                    get_annotation={props.get_annotation}
                    edit_annotation={props.edit_annotation}
                    delete_annotation={props.delete_annotation}
                  />
                }
              })}
            </section>)}


          {props.sidebar == 'new_annotation' && (
            <section className={styles.annotation_text_wrap}  >
              <div className={styles.annotation_title_wrap}>
                <input ref={props.input_ref} className={styles.title_input_search} placeholder="Title..." name="annotation_title_search" type="text" />
              </div>
              <div className={styles.annotation_text_wrap_inner}>
                <textarea ref={props.textarea_ref} className={styles.textarea_id} placeholder={'Notes...'} />
              </div>
              <div className={styles.button_wrap}>
                <div className={styles.save} onClick={() => props.save_annotation()}>Save</div>
                <div className={styles.cancel} onClick={() => props.cancel_annotation()}>Cancel</div>
              </div>
            </section>)}

        </motion.div>
      </motion.aside>
    </Fragment>

  )
}


