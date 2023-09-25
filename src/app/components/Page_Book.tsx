"use client";
import React, { Fragment, useState, useEffect } from "react";
import styles from "../css/homepage_styles.module.css";
import Book_Box from "./Book_Box";

type BookType = {
  title: string;
  author: string;
  url: string;
  id: string;
  path: string;
  height: number;
  width: number;
  color?: string;
  bg: string;
  border: string;
};

type Size = {
  width: number;
  height: number;
};

type BP_Props = {
  book: BookType;
  logged_in: boolean;
  email: string;
  user_id: string;
  cfi?: string | string[] | undefined;
  sparknotes_annotations: SparkType[] | undefined;
};

type SparkType = {
  cfi: string;
  quote: string;
  desc: string;
  page: string;
};

type Annotation_Item = {
  type: string;
  cfiRange: string;
  data: {
    text: string;
    data: string;
    section: string;
    time: string;
    title: string;
    epubcfi: string;
  };
  sectionIndex: number;
  mark?: {
    element: null;
    className: string;
    data: {
      text: string;
      data: string;
      section: string;
      time: string;
      title: string;
      epubcfi: string;
    };
    attributes: {
      fill: string;
      "fill-opacity": string;
      "mix-blend-mode": string;
    };
  };
};

type A_State = Annotation_Item[] | [];
//https://libguides.consortiumlibrary.org/c.php?g=488706&p=3342726
const default_options = [
  { label: "Descriptive", value: "Descriptive" },
  { label: "Evaluative ", value: "Evaluative " },
  { label: "Informative", value: "Informative" },
];

type default_uc = option_uc[];

type option_uc = {
  label: string;
  value: string;
};

export default function Book_Page(props: BP_Props): JSX.Element {
  const [size, set_dim] = useState<Size>({ width: 0, height: 0 });
  const [annotations, set_annotations] = useState<A_State>([]);
  const [user_categories, set_user_categories] =
    useState<default_uc>(default_options);

  useEffect(() => {
    async function get_book_data(book_id: string, user_id: string) {
      return await fetch(`/api/book?book_id=${book_id}&user_id=${user_id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data[0]) {
            if (data[0].user_categories && data[0].user_categories.length > 0) {
              set_user_categories(data[0].user_categories);
            }
            set_annotations(data[0].annotations);
          } else {
            set_annotations([]);
          }
        })
        .catch((err) => {
          console.log(err);
          set_annotations([]);
        });
    }

    function get_ls_data(book_id: string) {
      let ls_data = localStorage.getItem(book_id + "-annotations");
      let a =
        ls_data !== undefined && ls_data !== "undefined"
          ? JSON.parse(ls_data || "{}")
          : [];
      set_annotations(a);
    }

    if (props.logged_in) {
      get_book_data(props.book.id, props.user_id);
    } else {
      get_ls_data(props.book.id);
    }
  }, [props.book.id, props.logged_in, props.user_id]);

  function update_annotations(a: Annotation_Item[], c: option_uc | null) {
    set_annotations(a);
    if (c !== null) {
      set_user_categories((prevState) => [...prevState, c]);
    }
  }

  useEffect(() => {
    function updateDimensions() {
      set_dim({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <Fragment>
      {size.width > 0 && (
        <main className={styles.main}>
          <section
            className={styles.homepage_frame}
            style={{ backgroundColor: "#FFF" }}
          >
            <Book_Box
              selected_book={props.book}
              w={size.width}
              h={size.height}
              logged_in={props.logged_in}
              email={props.email}
              user_id={props.user_id}
              query_cfi={props.cfi}
              annotations={annotations}
              sparknotes_annotations={props.sparknotes_annotations}
              user_categories={user_categories}
              update_annotations={update_annotations}
            />
          </section>
        </main>
      )}
      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
        }
      `}</style>
    </Fragment>
  );
}
