'use client'
import React, { RefObject, Fragment, useState } from 'react'
import Sidebar_Icons from './Sidebar_Icons'
import { MdClose } from "react-icons/md"
import styles from '../css/sidebar_styles.module.css'
import { SidebarState } from '../types/sidebar_types'
import { IoMdTrash } from "react-icons/io"


type SIF_Props = {
  sidebar: SidebarState
  results_length: number  
  annotations_length: number
  clear_input: () => void
  set_sidebar: (x: SidebarState) => void
  handle_cancel_annotation: () => void
  spark_length: number
}


export default function Sidebar_Icons_Fixed(props: SIF_Props) {
  return (
    <div className={styles.sidebar_icons_fixed_col}>
      {props.sidebar == null ?
        <Sidebar_Icons spark_length={props.spark_length} results_length={props.results_length} annotations_length={props.annotations_length} set_sidebar={props.set_sidebar} />
        :
        <Fragment>
          <button aria-label = {"Close sidebar"} type={"button"} className={styles.close_sidebar_icon} onClick={() => props.sidebar == 'new_annotation' ? props.handle_cancel_annotation() : props.set_sidebar(null)}>
            <MdClose className={styles.close_sidebar} />
          </button>
          <Fragment>
            {props.sidebar == 'search' && (<button aria-label = {"Clear search and search results"} type={"button"} className={styles.trash_icon} onClick={() => props.clear_input()}><IoMdTrash className={styles.trash} /></button>)}
          </Fragment>
        </Fragment>
      }
    </div>
  )
}