

import React, { Component, Fragment} from 'react'
import styles from '../top_bar_styles.module.css'
import { FaBookOpen } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import _ from 'lodash'
import parse from 'html-react-parser';
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


<div className = {styles.title_wrap}>
    <div className = {styles.book_icon_wrap} onClick = {() => this.props.select_book(null)}>
    <FaBookOpen id = {styles.book_icon} />
    </div>
    <div id = {styles.title} onClick = {() => this.props.select_book(null)}>{title}</div>
   </div>

{this.props.selected_book !== null && (
<div id = {styles.home_button} onClick = {() => this.props.select_book(null)}> <AiFillHome id = {styles.home} /></div> )}


{this.state.results.length > 0    ?

<Fragment>
{this.props.selected_book == null ? 
<ul className = {styles.search_results_homepage}>
{this.state.results.map((x, i) => {
return <li key = {x + i} onClick = {() => this.props.select_book(x)}>
<span id = {styles.res_title}>{x.title}</span>,
<span id = {styles.res_author}> {x.author}</span>
</li>
})}
</ul>
: null }
</Fragment>
:  null}


<div className = {styles.header_wrap}>

{this.props.w > 1000 && (
<div className = {styles.topbar_search_wrap}>
<form  onSubmit={(e) => e.preventDefault()}  role="search">
    <input 
    id="search_input_homepage" 
    type="search" 
    placeholder="Search books..." 
    value={this.state.keyvalue}
    onChange={(e) => this.handleInputChange(e.target.value)}
    />
</form>
</div>

)}


  </div>

    </div>
  }
}

