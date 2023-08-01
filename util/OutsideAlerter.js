import React, {useRef, useEffect} from 'react'



export default function OutsideAlerter(props) {
  const wrapperRef = useRef(null);

function useOutsideAlerter(ref) {
  useEffect(() => {

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        props.cancel_search()
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {

      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

}  useOutsideAlerter(wrapperRef);
  return <div ref={wrapperRef} >{props.children}</div>;
}
