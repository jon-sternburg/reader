import React, { useRef, useEffect, RefObject } from 'react'


type OA_Props = {
  cancel_search: () => void
  children: JSX.Element | JSX.Element[]
}

export default function OutsideAlerter(props: OA_Props): JSX.Element {
  const wrapperRef = useRef(null);

  function useOutsideAlerter(ref: RefObject<HTMLElement>) {
    useEffect(() => {

      function handleClickOutside(event: Event) {
        const target = event.target as HTMLElement
        if (ref.current && !ref.current.contains(target)) {
          props.cancel_search()
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {

        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);

  } useOutsideAlerter(wrapperRef);
  return <div ref={wrapperRef} >{props.children}</div>;
}



