'use client'
import {Fragment} from 'react'
import styles from '../css/grid_styles.module.css'
import { signOut } from 'next-auth/react';
import { AiFillGithub } from "react-icons/ai"
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
<button aria-label = {"Login"} type = {'button'} onClick = {() => handle_login()}><span>Login</span></button>

: props.logged_in && props.email ? 
<Fragment>
  <a  href = {'/user'} className = {styles.user_tag_top}><span>{props.email}</span></a>
<button aria-label = {"Sign out"} type = {'button'} className = {styles.sign_out_top} onClick = {() =>  handle_signout()}><span>Sign out</span></button>
</Fragment>
: null
}
<AiFillGithub className = {styles.github_icon} />
</nav>


  )
}