'use client'
import React, {Fragment, useState, useEffect} from 'react'
import styles from '../css/grid_styles.module.css'
import { useSession, signOut } from 'next-auth/react';
import { AiFillGithub } from "react-icons/ai"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation"



type TBH_Props = {
logged_in: boolean
email: string | null
}

export default function Top_Bar_Homepage(props: TBH_Props): JSX.Element {

//const [logged_in, toggle_login] = useState<boolean>(false)

 // const { data: session } = useSession()
 const pathname = usePathname();
  const router = useRouter()




function handle_login() {

if (pathname.includes('login')) { 
  router.push('/')
} else {

  localStorage.setItem('prev_url_login', JSON.stringify(''));
  router.push('/login')
}
  }



  async function handle_signout() {
    await signOut({callbackUrl: process.env.NEXTAUTH_URL})
  }


  return (

<nav className = {styles.grid_buttons_top_wrap}>
{!props.logged_in ? 
<button type = {'button'} onClick = {() => handle_login()}>Login</button>

: props.logged_in && props.email ? 
<Fragment>
  <Link  href = {'/user'} className = {styles.user_tag_top}>{props.email}</Link>
<button type = {'button'} className = {styles.sign_out_top} onClick = {() =>  handle_signout()}>Sign out</button>
</Fragment>
: null
}
<AiFillGithub className = {styles.github_icon} />
</nav>


  )
}