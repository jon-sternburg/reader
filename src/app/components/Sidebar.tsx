"use client";
import React, {
  Fragment,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import styles from "../css/sidebar_styles.module.css";
import { FaSearch } from "react-icons/fa";
import { FaListOl } from "react-icons/fa";
import { FaStickyNote } from "react-icons/fa";
import { AiFillSetting, AiFillCloseCircle } from "react-icons/ai";
import Select, { StylesConfig } from "react-select";
import { CgFormatJustify } from "react-icons/cg";
import { GiMouse } from "react-icons/gi";
import { CgArrowsH } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";
import { NavItem, RS_Option, S_Props } from "../types/sidebar_types";
import Sidebar_Icons_Fixed from "./Sidebar_Icons_Fixed";
import Annotation_Wrapper from "./Annotation_Wrapper";
import Search_Section_Result from "./Search_Section_Result";
import Sidebar_New_Annotation from "./Sidebar_New_Annotation";
import { FaUserCircle } from "react-icons/fa";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Annotation_Item } from "../types/book_box_types";
import { GrDrag } from "react-icons/gr";
import { BsAsterisk } from "react-icons/bs";

const text_size_options = [
  { value: "x-large", label: "X-Large" },
  { value: "large", label: "Large" },
  { value: "medium", label: "Medium" },
  { value: "small", label: "Small" },
];
const customStyles: StylesConfig<RS_Option, false> = {
  control: (provided) => ({
    ...provided,
    background: "#fff",
    borderColor: "#9e9e9e",
    minHeight: "30px",
    height: "30px",
    color: "black",
  }),

  valueContainer: (provided) => ({
    ...provided,
    height: "30px",
    padding: "0 6px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "30px",
  }),
};

type DP_State = {
  show: boolean;
  cfi: string | null;
  i: number | null;
};

type option_uc = {
  label: string;
  value: string;
};

export default function Sidebar(props: S_Props) {
  const [sidebarWidth, setSidebarWidth] = useState<string | number>(
    props.w <= 1000 ? "100vw" : "50vw"
  );
  const sidebarRef = useRef<HTMLElement | null>(null);
  const resizer_ref = useRef<HTMLDivElement | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [delete_prompt, toggle_delete_prompt] = useState<DP_State>({
    show: false,
    cfi: null,
    i: null,
  });
  const [edit, set_edit] = useState<Annotation_Item | null>(null);
  const isNavItem = (content: NavItem | []): content is NavItem =>
    "label" in content;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const sidebarCollapsed = props.sidebar == null;
  const annotations = props.annotations;
  const sparknotes_annotations =
    props.sparknotes_annotations !== undefined
      ? props.sparknotes_annotations
      : [];

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing && sidebarRef.current !== null) {
        let width_ =
          mouseMoveEvent.clientX -
          sidebarRef.current.getBoundingClientRect().left;
        if (width_ <= props.w - props.w * 0.04 && width_ >= props.w * 0.5) {
          setSidebarWidth(width_);
        }
      }
    },
    [isResizing, props.w]
  );

  useEffect(() => {
    if (props.w >= 1000) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      return () => {
        window.removeEventListener("mousemove", resize);
        window.removeEventListener("mouseup", stopResizing);
      };
    }
  }, [resize, stopResizing, props.w]);

  const handle_default = (e: React.MouseEvent) => {
    if (e.target == resizer_ref.current) {
      e.preventDefault();
    }
  };

  function send_delete_annotation() {
    let cfi_ = delete_prompt.cfi !== null ? delete_prompt.cfi : "";
    let i_ = delete_prompt.i !== null ? delete_prompt.i : 0;
    props.delete_annotation(cfi_, i_);
    toggle_delete_prompt({ show: false, cfi: null, i: null });
  }

  function delete_annotation_pre(x: string, i: number) {
    toggle_delete_prompt({ show: true, cfi: x, i: i });
  }

  function cancel_prompt() {
    toggle_delete_prompt({ show: false, cfi: null, i: null });
  }

  function cancel_search() {
    props.clear_input();
  }

  function handle_user_click() {
    if (props.logged_in) {
      router.push("/user");
    } else {
      let cfi_params = searchParams.get("cfi");
      let cfi = cfi_params ? `?cfi=${cfi_params}` : "";
      let pn = pathname + cfi;
      localStorage.setItem("prev_url_login", JSON.stringify(pn));
      router.push("/login");
    }
  }

  function edit_annotation(a: Annotation_Item) {
    props.set_sidebar("new_annotation");
    set_edit(a);
  }

  function handle_cancel_annotation() {
    set_edit(null);
    props.cancel_annotation();
  }

  function handle_save_annotation(
    picked_category: option_uc | null,
    color: string,
    edit_: Annotation_Item | null,
    ta_val: string,
    input_val: string
  ) {
    props.save_annotation(picked_category, color, edit_, ta_val, input_val);
    set_edit(null);
  }

  let title =
    props.sidebar == "toc"
      ? "Contents"
      : props.sidebar == "settings"
      ? "Settings"
      : props.sidebar == "menu"
      ? "Menu"
      : props.sidebar == "mobile_search"
      ? "Search"
      : props.sidebar == "annotations"
      ? "Annotations"
      : props.sidebar == "search"
      ? "Text search"
      : props.sidebar == "sparknotes"
      ? "SparkNotes Annotations"
      : props.sidebar == "new_annotation"
      ? "New Annotation"
      : null;

  return (
    <Fragment>
      {props.w > 1000 && (
        <Sidebar_Icons_Fixed
          set_sidebar={props.set_sidebar}
          handle_cancel_annotation={handle_cancel_annotation}
          results_length={props.results.length}
          sidebar={props.sidebar}
          annotations_length={annotations.length}
          spark_length={sparknotes_annotations.length}
          clear_input={props.clear_input}
        />
      )}

      {!sidebarCollapsed && (
        <aside
          style={{ width: sidebarWidth }}
          className={styles.sidebar_frame}
          ref={sidebarRef}
          onMouseDown={handle_default}
        >
          <div className={styles.sidebar_inner_frame}>
            <div className={styles.sidebar_header}>
              {/* 
            <div className={styles.sidebar_icons}>
              {props.sidebar == 'toc' && (<button aria-label = {"Table of Contents"} type={"button"} className={styles.toc_icon_active}  ><FaListOl className={styles.toc} /></button>)}
              {props.sidebar == 'settings' && (<button aria-label = {"Settings"} type={"button"} className={styles.settings_icon_active} ><AiFillSetting className={styles.settings} /></button>)}
              {props.sidebar == 'annotations' && (<button aria-label = {"Annotations"} type={"button"} className={styles.annotations_icon_active} ><FaStickyNote className={styles.annotations} /></button>)}
              {props.sidebar == 'new_annotation' && (<button aria-label = {"New Annotation"} type={"button"} className={styles.new_annotation_icon_active} ><BiCommentAdd className={styles.new_annotation} /></button>)}
              {props.sidebar == 'mobile_search' && (<button aria-label = {"Search text"} type={"button"} className={styles.new_annotation_icon_active} ><FaSearch className={styles.new_annotation} /></button>)}
            </div>
*/}

              <header className={styles.sidebar_title}>
                {" "}
                <h5>{title}</h5>
                {props.sidebar == "menu" && props.w <= 1000 && (
                  <button
                    aria-label={"Close menu"}
                    type={"button"}
                    className={styles.toc_icon_close_mobile}
                    onClick={() => props.set_sidebar("menu")}
                  >
                    <AiFillCloseCircle className={styles.close_menu} />
                  </button>
                )}
                {props.sidebar == "search" && props.w <= 1000 && (
                  <button
                    aria-label={"Cancel search"}
                    type={"button"}
                    className={styles.toc_icon_close_mobile_search}
                    onClick={() => cancel_search()}
                  >
                    <AiFillCloseCircle className={styles.close_menu} />
                  </button>
                )}
                {(props.sidebar == "settings" ||
                  props.sidebar == "sparknotes" ||
                  props.sidebar == "toc" ||
                  props.sidebar == "mobile_search" ||
                  props.sidebar == "search" ||
                  props.sidebar == "annotations") &&
                  props.w <= 1000 && (
                    <button
                      aria-label={"Back to menu"}
                      type={"button"}
                      className={styles.toc_icon_back_mobile}
                      onClick={() => props.set_sidebar("menu")}
                    >
                      <IoIosArrowBack className={styles.toc} />
                    </button>
                  )}
              </header>

              {props.sidebar == "search" && (
                <section className={styles.search_results_wrap_sidebar}>
                  {props.results.length > 0 && (
                    <ul className={styles.search_results_wrap_sidebar_inner}>
                      <li className={styles.keyvalue_wrap}>
                        <blockquote>{props.keyvalue}</blockquote>
                      </li>
                      {props.results.map((x, i) => {
                        return (
                          <Search_Section_Result
                            key={i}
                            w={props.w}
                            x={x}
                            i={i}
                            get_context={props.get_context}
                            keyvalue={props.keyvalue}
                          />
                        );
                      })}
                    </ul>
                  )}
                </section>
              )}
            </div>

            {props.sidebar == "toc" && props.toc.length > 0 && (
              <section className={styles.toc_items}>
                {props.toc.map((x, i) => {
                  let label_ = isNavItem(x) ? x.label : "";
                  let href_ = isNavItem(x) ? x.href : "";
                  return (
                    <p
                      key={label_ + i}
                      onClick={() => props.set_location(href_)}
                    >
                      {label_}
                    </p>
                  );
                })}
              </section>
            )}

            {props.sidebar == "menu" && (
              <section className={styles.settings_wrap}>
                <button
                  aria-label={"User profile page"}
                  type={"button"}
                  className={styles.settings_option_mobile}
                  onClick={() => handle_user_click()}
                >
                  <FaUserCircle className={styles.settings_mobile_icon} />
                  <span>{props.logged_in ? props.email : "Login"}</span>
                </button>
                <button
                  aria-label={"Table of contents"}
                  type={"button"}
                  className={styles.settings_option_mobile}
                  onClick={() => props.set_sidebar("toc")}
                >
                  <FaListOl className={styles.settings_mobile_icon} />
                  <span>Table of Contents</span>
                </button>
                <button
                  aria-label={"Settings"}
                  type={"button"}
                  className={styles.settings_option_mobile}
                  onClick={() => props.set_sidebar("settings")}
                >
                  <AiFillSetting className={styles.settings_mobile_icon} />
                  <span>Settings</span>
                </button>
                <button
                  aria-label={"Annotations"}
                  type={"button"}
                  className={
                    annotations.length > 0
                      ? styles.settings_option_mobile
                      : styles.settings_option_mobile_disabled
                  }
                  onClick={() =>
                    annotations.length > 0
                      ? props.set_sidebar("annotations")
                      : {}
                  }
                >
                  <FaStickyNote className={styles.settings_mobile_icon} />
                  <span>Annotations</span>
                </button>
                <button
                  aria-label={"SparkNotes Annotations"}
                  type={"button"}
                  className={
                    sparknotes_annotations.length > 0
                      ? styles.settings_option_mobile
                      : styles.settings_option_mobile_disabled
                  }
                  onClick={() =>
                    sparknotes_annotations.length > 0
                      ? props.set_sidebar("sparknotes")
                      : {}
                  }
                >
                  <BsAsterisk className={styles.settings_mobile_icon} />
                  <span>SparkNotes Annotations</span>
                </button>
                <button
                  aria-label={"Search text"}
                  type={"button"}
                  className={styles.settings_option_mobile}
                  onClick={() =>
                    props.set_sidebar(
                      props.results.length > 0 ? "search" : "mobile_search"
                    )
                  }
                >
                  <FaSearch className={styles.settings_mobile_icon} />
                  <span>
                    {props.results.length > 0
                      ? "Search Results"
                      : "Search Text"}
                  </span>
                </button>

                <div className={styles.mobile_note}>
                  *Use the desktop version of this site to add new annotations.
                </div>
              </section>
            )}
            {props.sidebar == "mobile_search" && (
              <section className={styles.mobile_search_frame}>
                {props.mobile_search}
              </section>
            )}

            {props.sidebar == "settings" && (
              <section className={styles.settings_wrap}>
                {props.w > 1000 && (
                  <div className={styles.settings_option}>
                    <span className={styles.setting_name}>Page layout</span>
                    <div className={styles.options}>
                      <button
                        aria-label={"Single page layout"}
                        type={"button"}
                        className={
                          props.spread == "none"
                            ? styles["single_wrap"] + " " + styles["enabled"]
                            : styles["single_wrap"] + " " + styles["disabled"]
                        }
                        onClick={() => props.toggle_spread()}
                      >
                        <CgFormatJustify className={styles.single_page} />
                        <span>Single</span>
                      </button>
                      <button
                        aria-label={"Double page layout"}
                        type={"button"}
                        className={
                          props.spread == "auto"
                            ? styles["single_wrap"] + " " + styles["enabled"]
                            : styles["single_wrap"] + " " + styles["disabled"]
                        }
                        onClick={() => props.toggle_spread()}
                      >
                        <CgFormatJustify className={styles.double_page} />
                        <CgFormatJustify className={styles.double_page} />
                        <span>Double</span>
                      </button>
                    </div>
                  </div>
                )}
                <div className={styles.settings_option}>
                  <span className={styles.setting_name}>Navigation</span>
                  <div className={styles.options}>
                    <button
                      aria-label={"Scroll page layout"}
                      type={"button"}
                      className={
                        props.flow !== "paginated"
                          ? styles["scroll_flow"] + " " + styles["enabled"]
                          : styles["scroll_flow"] + " " + styles["disabled"]
                      }
                      onClick={() => props.toggle_flow()}
                    >
                      <GiMouse className={styles.scroll_flow_icon} />
                      {props.w >= 1000 && <span>Scroll</span>}
                    </button>
                    <button
                      aria-label={"Arrow page navigation layout"}
                      type={"button"}
                      className={
                        props.flow == "paginated"
                          ? styles["arrow_flow"] + " " + styles["enabled"]
                          : styles["arrow_flow"] + " " + styles["disabled"]
                      }
                      onClick={() => props.toggle_flow()}
                    >
                      <CgArrowsH className={styles.arrow_flow_icon} />
                      {props.w >= 1000 && <span>Arrow</span>}
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

            {props.sidebar == "annotations" && (
              <section className={styles.annotations_list_wrap}>
                <ul style={{ listStyleType: "none" }}>
                  {delete_prompt.show && (
                    <div className={styles.delete_prompt_frame}>
                      <p>Are you sure you want to delete this annotation?</p>
                      <div className={styles.bottom_buttons}>
                        <button
                          aria-label={"Delete annotation"}
                          type={"button"}
                          onClick={() => send_delete_annotation()}
                        >
                          Delete
                        </button>
                        <button
                          aria-label={"Cancel annotation"}
                          type={"button"}
                          onClick={() => cancel_prompt()}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {annotations.map((x: any, i: number) => {
                    return (
                      <Annotation_Wrapper
                        key={i}
                        x={x}
                        i={i}
                        sparknotes={false}
                        selected={props.si == i}
                        get_annotation={props.get_annotation}
                        edit_annotation={edit_annotation}
                        delete_annotation_pre={delete_annotation_pre}
                      />
                    );
                  })}
                </ul>
              </section>
            )}

            {props.sidebar == "sparknotes" && (
              <section className={styles.annotations_list_wrap}>
                <ul style={{ listStyleType: "none" }}>
                  {sparknotes_annotations.map((x: any, i: number) => {
                    return (
                      <Annotation_Wrapper
                        key={i}
                        x={x}
                        i={i}
                        sparknotes={true}
                        selected={props.si == i}
                        get_annotation={props.get_annotation}
                        edit_annotation={edit_annotation}
                        delete_annotation_pre={delete_annotation_pre}
                      />
                    );
                  })}
                </ul>
              </section>
            )}

            {props.sidebar == "new_annotation" && (
              <section className={styles.annotation_text_wrap}>
                <Sidebar_New_Annotation
                  user_categories={props.user_categories}
                  handle_save_annotation={handle_save_annotation}
                  handle_cancel_annotation={handle_cancel_annotation}
                  edit={edit}
                />
              </section>
            )}
          </div>
          {props.w >= 1000 && (
            <div
              className={styles.sidebar_resizer}
              onMouseDown={startResizing}
              ref={resizer_ref}
            >
              <GrDrag className={styles.resizer_icon} />
            </div>
          )}
        </aside>
      )}
    </Fragment>
  );
}
