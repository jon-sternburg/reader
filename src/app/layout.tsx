'use client'
import { Metadata } from 'next'
import { NextAuthProvider } from "./util/providers";
import { usePathname } from "next/navigation"

export const metadata: Metadata = {
  title: 'Reader!',
  description: 'Book Reader',
}

type RL_Props = {
  children: React.ReactNode
  modal: React.ReactNode
}


export default  function RootLayout(props: RL_Props) {

  const pathname = usePathname();
const modal_ = pathname.includes("login") ? props.modal : null

    return (

      <html lang="en">

        <body><NextAuthProvider>{props.children}{modal_}</NextAuthProvider></body>

      </html>

    )
  }





