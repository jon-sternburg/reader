"use client";
import React, { useState } from "react";
import styles from "../css/sidebar_styles.module.css";
import { TextSearchResultsData, ResultsData } from "../types/sidebar_types";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";

type SSR_Props = {
  key: number;
  w: number;
  x: ResultsData;
  i: number;
  get_context: (x: TextSearchResultsData, i: number, mobile: boolean) => void;
  keyvalue: string;
};

export default function Search_Section_Result(props: SSR_Props) {
  const [open, set_open] = useState(props.i == 0 ? true : false);

  function toggle_section() {
    set_open(!open);
  }

  function get_highlighted_text(text: string) {
    let highlight = props.keyvalue;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { color: "red" }
                : {}
            }
          >
            {part}
          </span>
        ))}{" "}
      </span>
    );
  }

  return (
    <li
      className={styles.search_result_section_wrap}
      style={{ listStyleType: "none" }}
    >
      <div className={styles.result_top_wrap} onClick={() => toggle_section()}>
        {!open ? (
          <MdOutlineExpandMore className={styles.book_item_expand_icon} />
        ) : (
          <MdOutlineExpandLess className={styles.book_item_expand_icon} />
        )}

        <p>{`${props.x.s.length} results found in ${props.x.label}`}</p>
      </div>

      {open && (
        <ul className={styles.search_result_item}>
          {props.x.s.map((y, i_) => {
            return (
              <li key={i_} style={{ listStyleType: "none" }}>
                <p onClick={() => props.get_context(y, i_, props.w < 1000)}>
                  {get_highlighted_text(y.excerpt)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
