'use client'
import React from "react";
import User_Page from '../components/User_Page'
import Auth_Form from '../components/Auth_Form'
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"


export default function App(): JSX.Element | void {

const { data: session, status } = useSession()
if (status == 'authenticated') { 

  return ( <User_Page /> )

} else if (status == 'loading') { 
  
return ( <div>LOADING</div>)

} else {
//this needs to be full window version, not popup
  return ( <Auth_Form />)

}

}
