import Page_Home from './components/Page_Home'
import { Metadata } from 'next'


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

export default function App(): JSX.Element {


  return (

    <Page_Home />
  )
}


