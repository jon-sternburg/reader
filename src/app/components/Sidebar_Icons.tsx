'use client'
import { useState } from 'react'
import styles from '../css/sidebar_styles.module.css'
import { FaSearch } from "react-icons/fa"
import { FaListOl } from "react-icons/fa"
import { FaStickyNote } from "react-icons/fa"
import { AiFillSetting } from "react-icons/ai"
import { SidebarState } from '../types/sidebar_types'

import { BsFillInfoCircleFill } from "react-icons/bs"
type SI_Props = {
  results_length: number
  annotations_length: number
  set_sidebar: (x: SidebarState) => void
}

export default function Sidebar_Icons(props: SI_Props) {
  const [show_tooltip, set_tooltip] = useState<boolean>(false)


  return (
    <div className={styles.sidebar_icons}>
      <button type={"button"} className={styles.toc_icon} onClick={() => props.set_sidebar('toc')} ><FaListOl className={styles.toc} /></button>
      <button type={"button"} className={styles.settings_icon} onClick={() => props.set_sidebar('settings')}><AiFillSetting className={styles.settings} /></button>
      <button type={"button"} className={props.annotations_length > 0 ? styles.annotations_icon : styles.annotations_icon_disabled} onClick={() => props.annotations_length > 0 ? props.set_sidebar('annotations') : {}}><FaStickyNote /></button>
      <button type={"button"} className={styles.settings_icon}   onMouseEnter={() => set_tooltip(true)}   onMouseLeave={() => set_tooltip(false)}><BsFillInfoCircleFill className={styles.settings} /></button>
      
      {props.results_length > 0 && (<button type={"button"} className={styles.indicator_icon} onClick={() => props.set_sidebar('search')}><FaSearch className={styles.indicator} /></button>)}

      {show_tooltip && (

<div className = {styles.tooltip}>

<p>Highlight text to create an annotation.</p>

</div>

)}
    </div>

  )
}