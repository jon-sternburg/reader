'use client'
import React from "react";
import User_Page from '../components/User_Page'
import Auth_Form from '../components/Auth_Form'
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"


export default function App(): JSX.Element | void {
const router = useRouter()
const { data: session, status } = useSession()
if (status == 'authenticated') { 

  return ( <User_Page /> )

} else if (status == 'loading') { 
  
//return ( <div>LOADING</div>)

} else {

router.push('/')
  //return ( <Auth_Form />)

}

}
