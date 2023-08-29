import React, { useState } from 'react'
import styles from '../css/sidebar_styles.module.css'
import { TextSearchResultsData, ResultsData } from '../types/sidebar_types'

type SSR_Props = {
  key: number
  w: number
  x: ResultsData
  i: number
  get_context: (x: TextSearchResultsData, i: number, mobile: boolean) => void
  keyvalue: string
}


export default function Search_Section_Result(props: SSR_Props) {
  const [open, set_open] = useState(props.i == 0 ? true : false)

  function toggle_section() {
    set_open(!open)
  }


  function get_highlighted_text(text: string) {

    let highlight = props.keyvalue

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <span> {parts.map((part, i) =>
      <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { color: 'red' } : {}}>
        {part}
      </span>)
    } </span>;
  }


  return (
    <div className={styles.search_result_section_wrap}>
      <h4 onClick={() => toggle_section()}>{`${props.x.s.length} results found in ${props.x.label}`}</h4>


      {open && (

        <div className={styles.search_result_item}>
          {props.x.s.map((y, i_) => {

            return <p key={i_} onClick={() => props.get_context(y, i_, props.w < 1000)}>{get_highlighted_text(y.excerpt)}</p>

          })}
        </div>
      )}

    </div>
  )




}