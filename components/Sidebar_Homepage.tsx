
import React, { ChangeEvent , Fragment, useMemo, useState, useEffect} from 'react'
import styles from '../css/sidebar_homepage_styles.module.css'
import { FcBookmark } from "react-icons/fc"
import all_book_data from '../data/all_book_data.json'
import debouce from "lodash.debounce";
import _ from 'lodash'
type SH_Props = {
  select_book: (book: BookType | null) => void
  w: number
  h: number
  book_list: boolean
  }
  
  type BookType = {
    title: string
    author: string
    url: string
    id: string
    path: string
    height: number
    width: number
    bg: string
    border: string
    color?: string
  }
  type ResultsState = BookType[] | []
export default function SidebarHomepage(props:SH_Props):JSX.Element {

    const [results, set_results] = useState<ResultsState>(all_book_data)



    useEffect(() => {
      return () => {
        debouncedResults.cancel();
      };
    });
    
    

    
    function handleSearchChange(e:ChangeEvent<HTMLInputElement>) {
    
            
      let kv = e.target.value
      if (kv.length == 0) {  
        set_results(all_book_data)

      } else { 



    
      const re = new RegExp(_.escapeRegExp(kv), "i");
      const isMatch_title = (result:BookType) => re.test(result.title);
      const isMatch_author = (result:BookType) => re.test(result.author)
    
      let _source = all_book_data
      let results_title = _.filter(_source, isMatch_title)
      let results_author = _.filter(_source, isMatch_author)
      let results_ = results_title.concat(results_author)

    set_results(results_)
    
    
    }}
    
    const debouncedResults = useMemo(() => {
    return debouce(handleSearchChange, 300);
    }, []);

    
    console.log(props.h)

    return (

<div className = {styles.grid_sidebar} >
<div className = {styles.grid_sidebar_top}>

{!props.book_list && (

<div  className = {styles.title_wrap}>
<FcBookmark className = {styles.book_icon} /><span className = {styles.title} onClick = {() => props.select_book(null)}>{'Reader!'}</span>
</div>
)}
<div className = {styles.sidebar_search_wrap}>
<form  onSubmit={(e) => e.preventDefault()}  role="search">
    <input 
    id="search_input_homepage" 
    placeholder="Search books..." 
    onChange={debouncedResults}
    type={"search"}
    name={"search_input_homepage"}
    />
</form>
</div>
</div>




<div className = {styles.book_list_wrap} >
{results.map((x,i) => {

return <div key = {i} className = {styles.sidebar_item} onClick ={() => props.select_book(x)}>
<span  className = {styles.sidebar_item_title}>{x.title}</span>
<span className = {styles.sidebar_item_author}>{x.author}</span>
</div>
})}
</div>

</div>

  )
}