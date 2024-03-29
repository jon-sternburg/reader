"use client";
import {
  Fragment,
  useState,
  useEffect,
  useRef,
  MouseEvent,
  SyntheticEvent,
  KeyboardEvent,
} from "react";
import styles from "../css/book_box_styles.module.css";
import ePub from "epubjs";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosCreate } from "react-icons/io";
import Sidebar from "./Sidebar";
import Loading_Circle from "./Loading_Circle";
import Top_Bar_Book from "./Top_Bar_Book";
import Mobile_Search from "./Mobile_Search";
import { AiFillHome } from "react-icons/ai";
import { FaEllipsisV } from "react-icons/fa";
import getTimeStamp from "../util/getTimeStamp";
import { useRouter } from "next/navigation";
import {
  Annotation_Item,
  AnnotationInner,
  BB_Props,
  TextSizeState,
  SidebarState,
  ResultsState,
  TextSearchResultsData,
  NavItem,
  CurrentLocType,
  renditionMarkClickedData,
  HighlightObj,
  TextSearchResults,
  SpineLoaded,
  RS_Option,
  SparkType,
} from "../types/book_box_types";
import Spine from "../../../node_modules/epubjs/types/spine";
import RenditionType from "../../../node_modules/epubjs/types/rendition";
import BookEpubType from "../../../node_modules/epubjs/types/book";
import ContentsType from "../../../node_modules/epubjs/types/contents";
import { EpubCFI } from "epubjs";
//let list =  require(`../data/scraped_book_list.json`)
type option_uc = {
  label: string;
  value: string;
};

type NewAnnotationData = {
  cfiRange: string;
  text: string;
  section: string;
  loc: CurrentLocType;
};

type NewAnnotationType = NewAnnotationData | null;

export default function Book_Box(props: BB_Props) {
  const router = useRouter();

  const [spread, set_spread] = useState<"auto" | "none">("auto");
  const [text_size, set_text_size] = useState<TextSizeState>({
    value: "medium",
    label: "Medium",
  });
  const [flow, set_flow] = useState<"paginated" | "scrolled">("paginated");
  const [keyvalue, set_keyvalue] = useState<string>("");
  const [results, set_results] = useState<ResultsState>([]);
  const [si, set_si] = useState<number | null>(null);
  const [sidebar, set_sidebar] = useState<SidebarState>(null);
  const [empty_results, set_empty_results] = useState<boolean>(false);
  const [loading, set_loading] = useState<boolean>(true);
  const toc = useRef<Array<NavItem> | []>([]);
  const new_annotation = useRef<NewAnnotationType>(null);
  const book = useRef<BookEpubType>(ePub(props.selected_book.path));
  const rendition = useRef<RenditionType>(
    book.current.renderTo("area", {
      width: "100%",
      height: "100%",
      flow: "paginated",
      manager: "default",
      spread: "auto",
    })
  );
  const prev_flow = useRef<"paginated" | "scrolled">("paginated");
  const search_highlights = useRef<Array<HighlightObj> | []>([]);
  const prev_spread = useRef<"auto" | "none">("auto");
  const annotation_ref = useRef<HTMLButtonElement | null>(null);
  const popup_ref = useRef<HTMLDivElement | null>(null);
  const isSpine = (content: Spine | SpineLoaded): content is SpineLoaded =>
    "spineItems" in content;
  const flag = empty_results && results.length == 0;

  function handle_mouse_down(e: Event) {
    const target = e.target as HTMLElement;
    if (
      (target.id == "" || target.id == undefined) &&
      popup_ref.current !== null &&
      popup_ref.current !== undefined
    ) {
      popup_ref.current.style.visibility = "hidden";
    }
  }

  //set book data in db (if user logged in)
  async function set_book_data(category: option_uc | null) {
    let annotations_ = get_filtered_annotations();
    let uc =
      category == null ||
      props.user_categories.filter(
        (x) => x.label.toLowerCase() == category.label.toLowerCase()
      ).length > 0
        ? props.user_categories
        : [...props.user_categories, category];

    return await fetch("/api/book", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.selected_book.id,
        name: props.selected_book.title,
        annotations: annotations_,
        user_id: props.user_id,
        edit: false,
        user_categories: uc,
      }),
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => {
        console.log(err);
        return null;
      });
  }

  //removes spark and text search highlighst
  function get_filtered_annotations() {
    let a_ = rendition.current.annotations.each().filter((x) => {
      let x_ = Array.isArray(x) ? x : null;
      if (x_ !== null) {
        let cfi_ = Array.isArray(x) ? x[1].cfiRange : "";
        let matching = search_highlights.current.filter((y) => y.cfi == cfi_);

        if (!x_[1].data.source && matching.length == 0) {
          return x;
        }
      }
    });

    let a = a_
      .map((x) => {
        if (Array.isArray(x)) {
          return x[1];
        }
      })
      .filter((y) => y !== undefined);
    return a;
  }

  /*

// used to map cfis to scraped sparknote quote data

  useEffect(() => {
    async function write_quote_data(quote_data) {


if (quote_data && quote_data.length > 0) { 

      return await fetch("/api/write_quote_data", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quote_data: quote_data, book_id: props.selected_book.id })
      })
        .then((res) => res.json())
        .then((data) => {

          let next_book_id = list.findIndex(x => x.id == props.selected_book.id)
          if (next_book_id >= 0) { 

            let next_book = list[next_book_id + 1]

      
          window.location.href = `http://localhost:3000/book/${next_book.id}`
          }
    
        })
        .catch(err => {
          console.log(err)
          return null
        })


         } else { 


          let next_book_id = list.findIndex(x => x.id == props.selected_book.id)
          if (next_book_id >= 0) { 

            let next_book = list[next_book_id + 1]

      
          window.location.href = `http://localhost:3000/book/${next_book.id}`
          }


         }
    }
    async function search_text(q_) {

      if (book.current && book.current != null ) {
        let quote = q_.quote
        let spine_ = book.current.spine
        let spine_items_ = isSpine(spine_) ? spine_.spineItems : []
      return await Promise.all(spine_items_.map(async x => {
          return await new Promise(async (resolve, reject) => {
            resolve(await x.load(book.current.load.bind(book.current)))
          })
            .then(async () => {
           return   await x.find(quote)
            })
            .then((s) => {
              let obj_ = { s: s, x: x }
              if (s.length > 0) { return obj_ }
            })
        })).catch(err => console.log(err))
        .then((results_) => {

          let results = results_.filter(z => z !== undefined)

          let res_ = results.map(x => {
            let matching = toc.current.filter(y => y.href.slice(0, y.href.indexOf('#')) == x.x.href)
            let label = matching && matching[0] && matching[0].label ? matching[0].label : ''
            let toc_id = matching && matching[0] && matching[0].id ? matching[0].id : ''
            return {section: label.trim(), cfi: x.s[0].cfi, quote: quote, desc: q_.desc, page: q_.page, sd: toc_id  }
          })

                  //removes duplicate 
                  if (res_.length > 1) { res_.pop()}
                 return res_
          
        })
      }
    }



    async function start_fetch() {


      console.log('fetching id: ', props.selected_book.id)
      await fetch(`/book_data/${props.selected_book.id}.json`, { cache: 'no-store' })
      .then((res) => res.json())
      .then(async (quote_data) => {
    
    console.log('quote_data initial fetch ', quote_data)
     await Promise.all(quote_data.map(async x => {
    return await search_text(x)
    })).catch(err => console.log(err))
    .then(async (d) => {
    let final_pre = [].concat.apply([], d).filter( x => x !== undefined)

    let final =  final_pre.sort((a, b) => parseInt(a.sd.replace('np-', '')) - parseInt(b.sd.replace('np-', '')))
      console.log('final: ', final)
      console.log('found ', final.length ,' out of ', quote_data.length)
    


    await write_quote_data(final)
    
    }).catch(err => console.log(err))
    })
    }

if (props.selected_book.id) { 
  setTimeout(() => {
    start_fetch()
  }, 3000);


}
      }, [props.selected_book.id])
*/

  useEffect(() => {
    let a_ = [];
    let s_ = [];
    rendition.current.annotations.each().map((x) => {
      let x_ = Array.isArray(x) ? x : null;
      if (x_ !== null) {
        if (!x_[1].data.source) {
          a_.push(x);
        } else {
          s_.push(x);
        }
      }
    });

    if (a_.length == 0) {
      if (props.annotations.length > 0) {
        props.annotations.map((x_: AnnotationInner) => {
          if (x_ !== null) {
            rendition.current.annotations.add(
              "highlight",
              x_.cfiRange,
              {
                text: x_.data.text,
                data: x_.data.data,
                section: x_.data.section,
                time: x_.data.time,
                title: x_.data.title,
                category: x_.data.category,
                color: x_.data.color,
              },
              () => {},
              styles.hl_,
              { fill: x_.data.color ? x_.data.color : "green" }
            );
          }
        });
      }
      let sa = props.sparknotes_annotations;
      if (s_.length == 0 && sa !== undefined && sa.length > 0) {
        sa.map((x_: SparkType) => {
          if (x_ !== null) {
            rendition.current.annotations.add(
              "highlight",
              x_.cfi,

              {
                text: x_.quote,
                source: x_.page,
                data: { data: x_.desc },
                section: x_.section,
                color: "#2196f3",
              },
              () => {},
              styles.hl_,
              { fill: "#2196f3" }
            );
          }
        });
      }
    }
  }, [props.annotations, props.sparknotes_annotations]);

  function set_url() {
    let loc_ = rendition.current.currentLocation();
    let url = new URL(window.location.href);
    url.searchParams.set("cfi", loc_.start.cfi);
    window.history.replaceState(
      {
        ...window.history.state,
        as: decodeURIComponent(url.href.toString()),
        url: decodeURIComponent(url.href.toString()),
      },
      "",
      decodeURIComponent(url.href)
    );
  }

  function annotation_cb(
    cfiRange: string,
    text: string,
    section: string,
    loc: CurrentLocType
  ) {
    let new_obj = {
      cfiRange: cfiRange,
      text: text,
      section: section,
      loc: loc,
    };
    new_annotation.current = new_obj;
    set_sidebar("new_annotation");
  }

  // builds book, adds annotations (from local storage or db), adds annotation event listeners, applies styles for annotation box, and performs cleanup
  useEffect(() => {
    async function get_next() {
      await rendition.current.next();
      set_url();
    }
    async function get_prev() {
      await rendition.current.prev();
      set_url();
    }

    function keyListener(e: KeyboardEvent | Event) {
      let e_ = e as KeyboardEvent;
      if (e_.key == "ArrowRight") {
        get_next();
      }
      if (e_.key == "ArrowLeft") {
        get_prev();
      }
    }

    // creates highlight in text
    function handle_annotation(cfiRange: string, text: string) {
      let loc: CurrentLocType = rendition.current.currentLocation();
      let matching = toc.current.filter(
        (y) => y.href.slice(0, y.href.indexOf("#")) == loc.start.href
      );
      let section_ =
        matching && matching[0] && matching[0].label
          ? matching[0].label
          : "No chapter available";

      annotation_cb(cfiRange, text, section_, loc);

      if (popup_ref.current !== null && popup_ref.current !== undefined) {
        popup_ref.current.style.visibility = "hidden";
      }
    }

    function annotation_clicked(cfiRange: string, sparknotes: boolean) {
      if (sparknotes && props.sparknotes_annotations) {
        let match_ = props.sparknotes_annotations.filter(
          (x) => x.cfi == cfiRange
        )[0];
        let i = props.sparknotes_annotations.indexOf(match_);
        set_sidebar("sparknotes");
        set_si(i);
      } else {
        let annotations = rendition.current.annotations.each();
        let fi = annotations.map((x) => {
          if (Array.isArray(x)) {
            return x[1];
          }
        });
        let matching = annotations.filter((x) => {
          if (Array.isArray(x)) {
            return x[1].cfiRange == cfiRange;
          }
        });
        let match_ = Array.isArray(matching[0]) ? matching[0] : [];
        let i = fi.indexOf(match_[1]);
        set_sidebar("annotations");
        set_si(i);
      }
    }

    book.current.ready
      .then(async function () {
        book.current.loaded.navigation
          .then((toc) => {
            // fix for red/blue color text in some epub files
            rendition.current.themes.default({
              "*:hover": { color: `black !important` },
              "*": {
                color: `black !important`,
                "text-decoration": "none !important",
              },
            });

            // set event listeners
            rendition.current.on("keyup", keyListener);
            document.addEventListener("keyup", keyListener);

            rendition.current.on(
              "markClicked",
              function (cfiRange: string, data: renditionMarkClickedData) {
                const sparknotes = data.source !== undefined ? true : false;
                annotation_clicked(cfiRange, sparknotes);
              }
            );

            const getRect = (target: Range, frame: Element | "" | null) => {
              const rect = target.getBoundingClientRect();
              const viewElementRect = frame
                ? frame.getBoundingClientRect()
                : { left: 0, top: 0 };
              const left = rect.left + viewElementRect.left;
              const right = rect.right + viewElementRect.left;
              const top = rect.top + viewElementRect.top;
              const bottom = rect.bottom + viewElementRect.top;
              return { left, right, top, bottom };
            };

            rendition.current.hooks.content.register(
              (contents: ContentsType /*view*/) => {
                const frame =
                  contents.document.defaultView !== null
                    ? contents.document.defaultView.frameElement
                    : "";

                contents.document.onclick = (e) => {
                  const selection = contents.document.getSelection();
                  if (selection !== null) {
                    let text = selection.toString();
                    if (text && text.length > 0) {
                      const range = selection.getRangeAt(0);
                      const { left, right, top, bottom } = getRect(
                        range,
                        frame
                      );

                      if (
                        annotation_ref.current !== null &&
                        annotation_ref.current !== undefined &&
                        popup_ref.current !== null &&
                        popup_ref.current !== undefined
                      ) {
                        let cfiRange = new EpubCFI(
                          range,
                          contents.cfiBase
                        ).toString();
                        annotation_ref.current.onclick = () =>
                          handle_annotation(cfiRange, text);
                        popup_ref.current.style.top = `${top + 20}px`;
                        popup_ref.current.style.right = `${right}px`;
                        popup_ref.current.style.left = `${left}px`;
                        popup_ref.current.style.bottom = `${bottom}px`;
                        popup_ref.current.style.visibility = "visible";
                      }
                    } else if (
                      popup_ref.current &&
                      popup_ref.current !== null
                    ) {
                      popup_ref.current.style.visibility = "hidden";
                    }
                  }
                };
              }
            );

            return toc;
          })
          .then((toc_) => {
            toc.current = toc_.toc;
            set_loading(false);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    return () => {
      document.removeEventListener("keyup", keyListener);
      document.removeEventListener("mousedown", handle_mouse_down);

      if (search_highlights.current && search_highlights.current.length > 0) {
        clear_input();
      }
      //  localStorage.setItem(props.selected_book.id + '-locations', JSON.stringify(rendition.current.location));
    };
  }, [props.selected_book.id, props.sparknotes_annotations]);

  // set book location after loading
  useEffect(() => {
    if (rendition.current && !loading) {
      if (
        props.query_cfi !== null &&
        props.query_cfi !== undefined &&
        !Array.isArray(props.query_cfi)
      ) {
        rendition.current.display(props.query_cfi);
      } else {
        rendition.current.display();
      }
    }
  }, [loading, props.query_cfi]);

  // resize for spread setting change
  useEffect(() => {
    if (rendition.current && spread !== prev_spread.current) {
      rendition.current.spread(spread);
      let el = document.getElementById("area");
      if (el !== null) {
        let el_dim = el.getBoundingClientRect();
        rendition.current.resize(el_dim.width, el_dim.height);
      }
    }
  }, [spread]);

  // resize for flow setting change
  useEffect(() => {
    if (rendition.current && flow !== prev_flow.current) {
      rendition.current.flow(flow);
      let el = document.getElementById("area");
      if (el !== null) {
        let el_dim = el.getBoundingClientRect();
        rendition.current.resize(el_dim.width, el_dim.height);
      }
      rendition.current.themes.default({
        "*:hover": { color: `black !important` },
        "*": {
          color: `black !important`,
          "text-decoration": "none !important",
        },
      });
    }
  }, [flow]);

  useEffect(() => {
    if (empty_results) {
      setTimeout(() => {
        set_empty_results(false);
      }, 2000);
    }
  }, [empty_results]);

  // scroll to effect after annotation save
  useEffect(() => {
    if (sidebar == "annotations" || sidebar == "sparknotes") {
      let arr_ = Array.from(document.getElementsByTagName("li"));
      let el = arr_.filter((x) => x.className.includes("selected"))[0];

      if (el !== null && el !== undefined) {
        el.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }
  }, [sidebar]);

  function toggle_flow() {
    prev_flow.current = flow;
    set_flow(flow == "paginated" ? "scrolled" : "paginated");
  }

  function toggle_spread() {
    prev_spread.current = spread;
    set_spread(spread == "auto" ? "none" : "auto");
  }

  function set_location(x: string) {
    rendition.current.display(x);
    set_url();
    set_sidebar(null);
  }

  function handle_set_text_size(x: RS_Option | null) {
    if (x !== null) {
      set_text_size(x);
      rendition.current.themes.default({
        p: { "font-size": `${x.label} !important` },
      });
      let el = document.getElementById("area");
      if (el !== null) {
        let el_dim = el.getBoundingClientRect();
        rendition.current.resize(el_dim.width, el_dim.height);
      }
    }
  }

  // jumps to highlight location
  function get_annotation(x: string, i: number) {
    rendition.current.display(x);
    set_url();
    set_si(i);
    set_sidebar(null);
  }

  function handle_highlight(cfiRange: string, text: string) {
    if (popup_ref.current !== null && popup_ref.current !== undefined) {
      popup_ref.current.style.visibility = "hidden";
      rendition.current.annotations.add(
        "highlight",
        cfiRange,
        { text: text, data: "notes go here", title: "highlight" },
        () => {},
        styles.hl_,
        { fill: "green" }
      );
    }
  }

  // adds marks for search highlights - these will be removed by clear input function when user cancels their text search
  function handle_search_highlight(
    e: Event | null,
    cfiRange: string,
    text: string,
    x: HighlightObj
  ) {
    rendition.current.annotations.add(
      "highlight",
      cfiRange,
      { text: text, data: `search for ${keyvalue}` },
      () => {},
      styles.hl_,
      { fill: "green" }
    );
    handle_set_search_highlights(x);
  }

  function handle_set_search_highlights(x: HighlightObj) {
    search_highlights.current = [...search_highlights.current, x];
  }

  function handle_set_sidebar(val: SidebarState) {
    if (sidebar == val) {
      set_sidebar(null);
    } else {
      set_sidebar(val);
    }
  }

  async function delete_annotation(x: string, i: number) {
    return new Promise((resolve, reject) => {
      resolve(rendition.current.annotations.remove(x, "highlight"));
    })
      .then(() => {
        let a_ls = get_filtered_annotations();
        if (props.logged_in) {
          set_book_data(null);
        } else {
          // need to filter out sparknotes and search highlights?

          localStorage.setItem(
            props.selected_book.id + "-annotations",
            JSON.stringify(a_ls)
          );
        }
        props.update_annotations(a_ls, null);
      })
      .catch((err) => console.log(err));
  }

  function cancel_annotation() {
    if (new_annotation.current !== null) {
      new_annotation.current = null;
      set_sidebar(null);
    } else {
      set_sidebar("annotations");
    }
  }

  async function save_annotation(
    picked_category: option_uc | null,
    color: string,
    edit: Annotation_Item | null,
    ta_value: string,
    input_value: string
  ) {
    let time = getTimeStamp();
    if (new_annotation.current !== null) {
      let cfiRange = new_annotation.current.cfiRange;
      let text = new_annotation.current.text;
      let section = new_annotation.current.section;
      let loc = new_annotation.current.loc;

      rendition.current.annotations.add(
        "highlight",
        cfiRange,
        {
          text: text,
          data: ta_value,
          section: section,
          time: time,
          title: input_value,
          loc: loc,
          category: picked_category,
          color: color,
        },
        () => {},
        undefined,
        { fill: color }
      );
      new_annotation.current = null;
      let a_ls = get_filtered_annotations();
      if (props.logged_in) {
        set_book_data(picked_category);
      } else {
        localStorage.setItem(
          props.selected_book.id + "-annotations",
          JSON.stringify(a_ls)
        );
      }
      props.update_annotations(a_ls, picked_category);
      set_sidebar("annotations");
      set_si(a_ls.length - 1);
    } else {
      let annotations = rendition.current.annotations.each();

      let dc_ = edit !== null ? edit.cfiRange : "";

      let matching = annotations.filter((x) => {
        if (Array.isArray(x)) {
          return (
            decodeURI(x[0]).replace("highlight", "") ==
            dc_.replace("highlight", "")
          );
        }
      });

      let text = Array.isArray(matching[0]) ? matching[0][1].data.text : "";
      let section = Array.isArray(matching[0])
        ? matching[0][1].data.section
        : "";
      let f = Array.isArray(matching[0]) ? matching[0][1] : "";
      let index = annotations
        .map((x) => {
          if (Array.isArray(x)) {
            return x[1];
          }
        })
        .indexOf(f);

      return new Promise((resolve, reject) => {
        let match_ = Array.isArray(matching[0]) ? matching[0][1] : null;

        if (match_ !== null) {
          if (color !== match_.data.color) {
            resolve(
              rendition.current.annotations.remove(match_.cfiRange, "highlight")
            );

            rendition.current.annotations.add(
              "highlight",
              match_.cfiRange,
              {
                text: text,
                data: ta_value,
                section: section,
                time: time,
                title: input_value,
                category: picked_category,
                color: color,
              },
              () => {},
              undefined,
              { fill: color }
            );
          } else {
            resolve(
              match_.update({
                text: text,
                data: ta_value,
                title: input_value,
                section: section,
                time: time,
                category: picked_category,
                color: color,
              })
            );
          }
        }
      })
        .then(() => {
          let a_ls = get_filtered_annotations();
          if (props.logged_in) {
            set_book_data(picked_category);
          } else {
            localStorage.setItem(
              props.selected_book.id + "-annotations",
              JSON.stringify(a_ls)
            );
          }
          props.update_annotations(a_ls, picked_category);
          set_sidebar("annotations");
          set_si(index);
        })
        .catch((err) => console.log(err));
    }
  }

  async function previous_page(e: MouseEvent | KeyboardEvent) {
    await rendition.current.prev();
    set_url();
  }

  async function next_page(e: MouseEvent | KeyboardEvent) {
    await rendition.current.next();
    set_url();
  }

  function handleInputChange_text(keyvalue: string) {
    if (keyvalue.length == 0 && props.w >= 1000) {
      clear_input();
    } else {
      set_keyvalue(keyvalue);
    }
  }

  // text search function
  function handle_text_submit(e: SyntheticEvent) {
    e.preventDefault();

    if (book.current && book.current != null && keyvalue.length > 2) {
      let results: TextSearchResults[] = [];
      let spine_ = book.current.spine;
      let spine_items_ = isSpine(spine_) ? spine_.spineItems : [];
      // builds each section for text search - results will be categorized by spine section
      Promise.all(
        spine_items_.map(async (x) => {
          return new Promise((resolve, reject) => {
            resolve(x.load(book.current.load.bind(book.current)));
          })
            .then(() => x.find(keyvalue))
            .then((s) => {
              let s_ = s as TextSearchResultsData[] | [];
              let obj_ = { s: s_, x: x };
              if (s.length > 0) {
                results.push(obj_);
              }
            });
        })
      )
        .catch((err) => console.log(err))
        .then(() => {
          // removes duplicate excerpts
          let no_duplicates: TextSearchResults[] = results.map((x) => {
            let new_s: TextSearchResultsData[] = [];
            let new_s_excerpts: string[] = [];
            x.s.map((y) => {
              if (!new_s_excerpts.includes(y.excerpt)) {
                new_s_excerpts.push(y.excerpt);
                new_s.push(y);
              }
            });
            return { ...x, s: new_s };
          });

          let res_ = no_duplicates.map((x) => {
            let matching = toc.current.filter(
              (y) => y.href.slice(0, y.href.indexOf("#")) == x.x.href
            );
            let label =
              matching && matching[0] && matching[0].label
                ? matching[0].label
                : "";
            let toc_id =
              matching && matching[0] && matching[0].id ? matching[0].id : "";
            return { s: x.s, x: x.x, label: label, sd: toc_id };
          });
          // sorts by chapter order
          let res = res_.sort(
            (a, b) =>
              parseInt(a.sd.replace("np-", "")) -
              parseInt(b.sd.replace("np-", ""))
          );
          if (res && res.length > 0) {
            set_sidebar("search");
          }
          set_empty_results(res && res.length > 0 ? false : true);
          set_results(res);
        })
        .catch((err) => console.log(err));
    }
  }

  function get_context(x: TextSearchResultsData, i: number, mobile: boolean) {
    set_si(i);
    rendition.current.display(x.cfi);
    set_url();
    handle_search_highlight(null, x.cfi, x.excerpt, x);
    if (mobile) {
      set_sidebar(null);
    }
  }

  // removes highlights for text search results
  async function clear_input() {
    let annotations = rendition.current.annotations.each();
    return Promise.all(
      annotations.map((x) => {
        return new Promise((resolve, reject) => {
          let cfi_ = Array.isArray(x) ? x[1].cfiRange : "";
          let matching = search_highlights.current.filter((y) => y.cfi == cfi_);
          if (matching && matching.length > 0) {
            resolve(rendition.current.annotations.remove(cfi_, "highlight"));
          } else {
            resolve(null);
          }
        });
      })
    )
      .then(() => {
        set_results([]);
        set_keyvalue("");
        set_sidebar(null);
        search_highlights.current = [];
      })
      .catch((err) => console.log(err));
  }

  return (
    <Fragment>
      <Fragment>
        <div
          ref={popup_ref}
          className={styles.popup}
          onClick={(e) => e.preventDefault()}
        >
          <button
            aria-label={"Create annotation"}
            type={"button"}
            ref={annotation_ref}
            className={styles.popup_annotation}
          >
            <IoIosCreate className={styles.annotation_icon} />
            <span>Annotation</span>
          </button>
        </div>

        {flag && (
          <div className={styles.no_results}>
            {" "}
            No results. Try another search!
          </div>
        )}
      </Fragment>

      {props.w > 1000 && (
        <Top_Bar_Book
          selected_book={props.selected_book}
          clear_input={clear_input}
          results_length={results.length}
          keyvalue={keyvalue}
          logged_in={props.logged_in}
          email={props.email}
          handle_text_submit={handle_text_submit}
          handleInputChange_text={handleInputChange_text}
          w={props.w}
        />
      )}

      {rendition !== null && (
        <div
          className={styles.book_box_frame}
          style={{ width: props.w <= 1000 ? props.w : props.w - 80 }}
        >
          {sidebar !== null && props.w > 1000 && (
            <div
              className={styles.book_tint}
              //  onClick={() => handle_set_sidebar(null)}
            />
          )}

          <Sidebar
            book_title={props.selected_book.title}
            sidebar={sidebar}
            logged_in={props.logged_in}
            set_sidebar={handle_set_sidebar}
            toc={toc.current}
            email={props.email}
            user_categories={props.user_categories}
            annotations={props.annotations}
            w={props.w}
            mobile_search={
              <Mobile_Search
                selected_book={props.selected_book}
                clear_input={clear_input}
                results_length={results.length}
                keyvalue={keyvalue}
                handle_text_submit={handle_text_submit}
                handleInputChange_text={handleInputChange_text}
              />
            }
            rendition={rendition.current}
            get_context={get_context}
            toggle_flow={toggle_flow}
            sparknotes_annotations={props.sparknotes_annotations}
            toggle_spread={toggle_spread}
            set_text_size={handle_set_text_size}
            text_size={text_size}
            delete_annotation={delete_annotation}
            set_location={set_location}
            spread={spread}
            flow={flow}
            keyvalue={keyvalue}
            get_annotation={get_annotation}
            results={results}
            si={si}
            save_annotation={save_annotation}
            cancel_annotation={cancel_annotation}
            clear_input={clear_input}
          />

          {loading && <Loading_Circle />}

          <section id="area" className={styles.book_box_inner_wrap}>
            {props.w > 1000 && (
              <Fragment>
                {sidebar == null && (
                  <button
                    aria-label={"Previous page"}
                    type={"button"}
                    className={styles.arrow_left_arrow_wrap}
                    onClick={(e) => previous_page(e)}
                  >
                    <IoIosArrowBack className={styles.left_arrow_icon} />
                  </button>
                )}
                <button
                  aria-label={"Next page"}
                  type={"button"}
                  className={styles.arrow_right_arrow_wrap}
                  onClick={(e) => next_page(e)}
                >
                  <IoIosArrowForward className={styles.right_arrow_icon} />
                </button>
              </Fragment>
            )}
            {props.w <= 1000 && sidebar == null && (
              <Fragment>
                <footer className={styles.bottom_bar_wrap}>
                  <button
                    aria-label={"Previous page"}
                    type={"button"}
                    onClick={(e) => previous_page(e)}
                  >
                    <IoIosArrowBack className={styles.left_arrow_icon} />
                  </button>
                  <button
                    aria-label={"Home"}
                    type={"button"}
                    onClick={() => router.push("/")}
                  >
                    <AiFillHome className={styles.home_mobile} />
                  </button>
                  <button
                    aria-label={"Menu"}
                    type={"button"}
                    onClick={() => handle_set_sidebar("menu")}
                  >
                    {" "}
                    <FaEllipsisV className={styles.settings_mobile} />
                  </button>
                  <button
                    aria-label={"Next page"}
                    type={"button"}
                    onClick={(e) => next_page(e)}
                  >
                    {" "}
                    <IoIosArrowForward className={styles.right_arrow_icon} />
                  </button>
                </footer>
              </Fragment>
            )}
          </section>
        </div>
      )}
    </Fragment>
  );
}
