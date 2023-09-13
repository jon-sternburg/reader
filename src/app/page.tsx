import Page_Home from './components/Page_Home'
import { Metadata } from 'next'
import { getServerSession } from "next-auth/next"
import auth_options from './auth_options'

export const metadata: Metadata = {
  title: 'Reader!',
  description: 'Read and annotate your favorite eBooks from the Project Gutenberg Library',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico'
}
}

export default async function Page(): Promise<JSX.Element> {

  const session = await getServerSession(auth_options)


  const logged_in = session == null ? false : true
  const email = session?.user.email ? session.user.email : ''


  return (

    <Page_Home logged_in = {logged_in} email = {email} />
  )
}


