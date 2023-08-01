

import React, { Component, Fragment, PureComponent} from 'react'
//import '../pages/css/top_bar.css'
import styles from '../top_bar_styles.module.css'
import { FaBookOpen } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import { AiFillSetting } from "react-icons/ai"
import _ from 'lodash'
import { MdClose } from "react-icons/md"
import parse from 'html-react-parser';
import ePub from 'epubjs'
import {EpubCFI} from 'epubjs'
import { AiOutlineLeft } from "react-icons/ai"
import { AiOutlineRight } from "react-icons/ai"
import { FaStickyNote } from "react-icons/fa"

let book_data = require('./update_books.json')

export default class Top_Bar_Homepage extends Component {
constructor(props) {
  super(props);
  this.state = { 
    keyvalue: '',
    results: [],
  };

this.input = React.createRef();

}


cancel_search = () => this.setState({results: [], keyvalue: ''})

handleInputChange_text = keyvalue => this.setState({keyvalue: keyvalue})


handleInputChange = (keyvalue) => {
this.setState({keyvalue: keyvalue})
this.handleSearchChange()
  };


  handleSearchChange = (e) => {
    setTimeout(() => {
      if (this.state.keyvalue.length < 1) 
        this.setState({keyvalue: '', results: []})


    const re = new RegExp(_.escapeRegExp(this.state.keyvalue), "i");
    const isMatch_title = (result) => re.test(result.title);
    const isMatch_author = (result) => re.test(result.author)

    let _source = book_data
    let results_title = _.filter(_source, isMatch_title)
    let results_author = _.filter(_source, isMatch_author)
    let results = results_title.concat(results_author)

if (this.state.keyvalue.length > 2) {

this.setState({results: results})
}}, 500);
    
}




  render() {
let title = this.props.selected_book == null ? 'Reader' : this.props.selected_book.title

    return <div className = {styles.top_bar_frame}>


<div className = {styles.title_wrap_mobile}>
    <div className = {styles.book_icon_wrap_mobile} >
    <FaBookOpen id = {styles.book_icon_mobile} />
    </div>
    <div id = {styles.title_mobile} >{title}</div>
   </div>

{this.props.selected_book !== null && (
<div id = {styles.home_button} onClick = {() => this.props.select_book(null)}> <AiFillHome id = {styles.home} /></div> )}


{this.state.results.length > 0    ?

<Fragment>
{this.props.selected_book == null ? 
<Fragment>
<ul className = {styles.search_results_homepage_mobile}>
{this.state.results.map((x, i) => {
return <li key = {x + i} onClick = {() => this.props.select_book(x)}>
<p>

{x.title}, <span style = {{fontStyle: 'italic'}}> {x.author} </span>

</p>

</li>
})}
</ul>

<div onClick = {() => this.cancel_search()} className = {styles.cancel_mobile_search}>Cancel search</div>
</Fragment>
: null }
</Fragment>
:  null}




<div className = {styles.header_wrap}>


<div className = {styles.topbar_search_wrap_mobile}>
<form  onSubmit={(e) => e.preventDefault()}  role="search">
    <input 
    id="search_input_homepage" 
    placeholder="Search..." 
    value={this.state.keyvalue}
    onChange={(e) => this.handleInputChange(e.target.value)}
    />
</form>
</div>



  </div>

    </div>
  }
}

