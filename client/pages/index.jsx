import { useContext } from 'react'
import { DataContext } from '../context'
import { Card, GridSection } from '../components'

// TODO: Remove when real data work.
const dummyCards = [
  {
    imgSrc: 'https://f8n-production-collection-assets.imgix.net/0x7bD33f9DfBCe127EAD20E69971359A2cF8A1a075/8/nft.png',
    title: 'STRONG HAIR : 068 : ፷፰',
    collectionTitle: 'Strong Hair ጠንካራ ፀጉር',
    price: '1'
  },
  {
    imgSrc: 'https://f8n-ipfs-production.imgix.net/QmYUfGLPXbesEQtswdSQak6EeRrf2rVpPN6HqXpJquNbZx/nft.jpg',
    title: '( RARE ) SPTX-08 : THE ASSASSINS',
    collectionTitle: 'spectre x',
    price: '1.70'
  },
  {
    imgSrc: 'https://f8n-production-collection-assets.imgix.net/0x10f74C70685e80185cd88965049ED8361F7D0BE0/6/nft.jpg',
    title: 'Phantom',
    collectionTitle: 'Kareido art works',
    price: '0.75'
  },
  {
    imgSrc: 'https://f8n-production-collection-assets.imgix.net/0x77F1c0B2c1638b0E32F1379f6733117B3B39339D/3/nft.jpg',
    title: 'Altinha',
    collectionTitle: 'Clairdelune',
    price: '1.60'
  }
]

export default function Home() {
  const { loadNFTs, nfts, loaded } = useContext(DataContext)

  if (loaded && !nfts.length) return (
    <h1>No items in marketplace</h1>
  )

  return (
    <GridSection
      title='Trending auctions'
      linkName='View all auctions'
      ping
    >
      {/* TODO: Implement buy action */}
      {nfts.map(({ image, name, description, price }, idx) =>
        <Card
          key={idx}
          imgSrc={image}
          title={name}
          collectionTitle={description}
          price={price}
          symbol='eth'
        />
      )}
    </GridSection>
  )
}
