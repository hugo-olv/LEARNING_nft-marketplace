import '../styles/globals.css'
import { DataProvider } from '../context'
import { Layout } from '../components'

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DataProvider>
  )
}

export default MyApp
