import React, {Fragment, useState, useEffect, useRef, useCallback  } from "react";
import Homepage from '../components/Homepage'





const App = (props) => {
 const [size, set_size] = useState({width: 0, height: 0})



useEffect(() => {
set_size({width: window.innerWidth, height: window.innerHeight})
  }, [])
 return (

<Homepage size = {size} />

)}
export default App

