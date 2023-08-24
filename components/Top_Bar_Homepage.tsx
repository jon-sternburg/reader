import React, { ChangeEvent , Fragment, useMemo, useState, useEffect} from 'react'
import styles from '../top_bar_styles.module.css'
import { AiFillHome } from "react-icons/ai"
import { FcBookmark } from "react-icons/fc"
import _ from 'lodash'
import OutsideAlerter from '../util/OutsideAlerter'
import all_book_data from '../data/all_book_data.json'
import debouce from "lodash.debounce";

type BookType = {
  title: string
  author: string
  url: string
  id: string
  path: string
  height: number
  width: number
  color?: string
  bg: string
  border: string
}


type TBH_Props = {
  select_book: (book: BookType | null) => void
  selected_book: BookType | null
  w:number
  h:number
}

type ResultsState = BookType[] | []

export default function Top_Bar_Homepage(props:TBH_Props) {


const [results, set_results] = useState<ResultsState>([])



useEffect(() => {
  return () => {
    debouncedResults.cancel();
  };
});


function cancel_search() {
set_results([])

}


function handleSearchChange(e:ChangeEvent<HTMLInputElement>) {

  let kv = e.target.value
  const re = new RegExp(_.escapeRegExp(kv), "i");
  const isMatch_title = (result:BookType) => re.test(result.title);
  const isMatch_author = (result:BookType) => re.test(result.author)

  let _source = all_book_data
  let results_title = _.filter(_source, isMatch_title)
  let results_author = _.filter(_source, isMatch_author)
  let results_ = results_title.concat(results_author)
if (kv.length > 2) {
set_results(results_)
}

}

const debouncedResults = useMemo(() => {
return debouce(handleSearchChange, 300);
}, []);




    return ( 

      <nav className = {styles.top_bar_frame}>




{props.selected_book !== null && (
<div className = {styles.home_button} onClick = {() => props.select_book(null)}> <AiFillHome className = {styles.home} /></div> )}


{results.length > 0    ?

<Fragment>
{props.selected_book == null ? 
<OutsideAlerter cancel_search = {cancel_search}>
<ul className = {styles.search_results_homepage}>
{results.map((x, i) => {
return <li key = {i} onClick = {() => props.select_book(x)}>
<p>

{x.title}, <span style = {{fontStyle: 'italic'}}> {x.author} </span>

</p>

</li>
})}
</ul>
</OutsideAlerter>
: null }
</Fragment>
:  null}


<div className = {styles.header_wrap}>

{props.w > 1000 && (
<div className = {styles.topbar_search_wrap}>
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

)}


  </div>

    </nav>
  )
}

