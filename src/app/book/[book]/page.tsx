import Page_Book from '../../components/Page_Book'
import all_book_data from '../../data/all_book_data.json'
import { Metadata, ResolvingMetadata } from 'next'




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




export default function Page({ params, searchParams }: Props): JSX.Element {


  const book = all_book_data.filter(x => x.id == params.book)[0]
  const cfi = searchParams.cfi

  return (


<Page_Book cfi = {cfi}  book={book}/>


  )
}


