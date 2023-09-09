import React from "react";
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import Page_User from "../components/Page_User";
import { getServerSession } from "next-auth/next"
import  auth_options  from "../auth_options"

export const metadata: Metadata = {
  title: 'Reader! - User Page',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico'
}
}


export default async function Page(): Promise<JSX.Element | void> {

  const session = await getServerSession(auth_options)
  console.log('SESSION: ', session)
  
  if (session) { 
  
    return ( 
    <Page_User /> 
    )
  
  }  else {
  
    redirect('/')
  
  
  }
  
  }