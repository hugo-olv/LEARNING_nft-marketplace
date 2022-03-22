import Link from 'next/link'
import { Card, GridSection } from '../components'

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
    imgSrc: 'https://f8n-production-collection-assets.imgix.net/0x38Df39aEbC131e51f3c980bb34bd76007e1b179F/6/nft.jpg',
    title: 'Altinha',
    collectionTitle: 'Clairdelune',
    price: '1.60'
  }
]

export default function Home() {

  return (
    <GridSection
      title='Trending auctions'
      linkName='View all auctions'
      ping
    >
      {dummyCards.map(({ imgSrc, title, collectionTitle, price }, idx) =>
        <Card
          key={idx}
          imgSrc={imgSrc}
          title={title}
          collectionTitle={collectionTitle}
          price={price}
          symbol='eth'
        />
      )}
    </GridSection>
  )
}
