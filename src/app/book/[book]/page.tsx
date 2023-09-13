import Page_Book from '../../components/Page_Book'
import all_book_data from '../../data/all_book_data.json'
import { Metadata, ResolvingMetadata } from 'next'
import { getServerSession } from "next-auth/next"
import auth_options from '../../auth_options'


type Props = {
  params: { 
    book: string
    cfi?: string | null
   }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const book = all_book_data.filter(x => x.id == params.book)[0]
  const page_title = book.title



  return {
    title: page_title,
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
    icons: {
      icon: '/favicon.ico'
  }
  }
}




export default async function Page({ params, searchParams }: Props): Promise<JSX.Element> {
  const session = await getServerSession(auth_options)
  const logged_in = session == null ? false : true
  const user_id = session?.user._id ? session.user._id : ''
  const email = session?.user.email ? session.user.email : ''
  const book = all_book_data.filter(x => x.id == params.book)[0]
  const cfi = searchParams.cfi

  return (


<Page_Book cfi = {cfi}  book={book} logged_in = {logged_in} user_id = {user_id} email = {email} />


  )
}


