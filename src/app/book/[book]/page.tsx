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

type ScrapedList = {
title: string
author: string
href: string
id: string
count: number 
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



  function get_spark(id: string) {


    const list = require('../../data/complete_scraped_book_list.json')
    
    const match = list.filter((x: ScrapedList) => x.id == id)
    
    if (match && match.length > 0) { 
    
    let data = require(`../../data/complete_book_data/${id}.json`)
    return data
    
    } else { return undefined }
    }
  

  
export default async function Page({ params, searchParams }: Props): Promise<JSX.Element> {
  const session = await getServerSession(auth_options)
  const logged_in = session == null ? false : true
  const user_id = session?.user._id ? session.user._id : ''
  const email = session?.user.email ? session.user.email : ''
  const book = all_book_data.filter(x => x.id == params.book)[0]
  const cfi = searchParams.cfi


  const sparknotes_annotations = get_spark(book.id)


  return (


<Page_Book cfi = {cfi}  book={book} logged_in = {logged_in} user_id = {user_id} email = {email} sparknotes_annotations={sparknotes_annotations}/>


  )
}


