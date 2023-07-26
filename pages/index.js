import React, {Fragment, useState, useEffect, useRef, useCallback  } from "react";
import Homepage from '../components/Homepage'





const App = (props) => {
 const [size, set_size] = useState({width: 0, height: 0})



useEffect(() => {
  console.log(window.innerWidth, ' / ',  window.innerHeight)
set_size({width: window.innerWidth, height: window.innerHeight})
  }, [])
 return (

<Homepage size = {size} />

)}
export default App

/*
const Homepage_ = (props) => {
   const isBreakpoint = useMediaQuery(1000)
   return (
    <Fragment>
{ isBreakpoint ?  <Homepage {...props} />  :   <Homepage {...props} /> } 
</Fragment>
)} 



const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addListener(updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeListener(updateTarget);
  }, []);

  return targetReached;
};
*/