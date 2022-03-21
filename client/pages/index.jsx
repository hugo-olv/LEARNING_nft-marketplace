import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

const dummyCards = [
  {
    imgSrc: 'https://f8n-production-collection-assets.imgix.net/0x7bD33f9DfBCe127EAD20E69971359A2cF8A1a075/8/nft.png?q=80&auto=format%2Ccompress&cs=srgb&max-w=1680&max-h=1680',
    title: 'STRONG HAIR : 068 : ፷፰',
    collectionTitle: 'Strong Hair ጠንካራ ፀጉር',
    price: '1'
  },
  {
    imgSrc: 'https://f8n-ipfs-production.imgix.net/QmYUfGLPXbesEQtswdSQak6EeRrf2rVpPN6HqXpJquNbZx/nft.jpg?q=80&auto=format%2Ccompress&cs=srgb&max-w=1680&max-h=1680',
    title: '( RARE ) SPTX-08 : THE ASSASSINS',
    collectionTitle: 'spectre x',
    price: '1.70'
  },
  {
    imgSrc: 'https://f8n-production-collection-assets.imgix.net/0x10f74C70685e80185cd88965049ED8361F7D0BE0/6/nft.jpg?q=80&auto=format%2Ccompress&cs=srgb&max-w=1680&max-h=1680',
    title: 'Phantom',
    collectionTitle: 'Kareido art works',
    price: '0.75'
  },
  {
    imgSrc: 'https://f8n-production-collection-assets.imgix.net/0x38Df39aEbC131e51f3c980bb34bd76007e1b179F/6/nft.jpg?q=80&auto=format%2Ccompress&cs=srgb&max-w=1680&max-h=1680',
    title: 'Altinha',
    collectionTitle: 'Clairdelune',
    price: '1.60'
  }
]

const Card = ({ imgSrc, imgAlt, title, collectionUrl, collectionTitle, price, symbol }) => {
  return (
    <div className='flex flex-col flex-auto sm:min-w-[340px] rounded-lg shadow-md overflow-hidden'>
      <div>
        <Image src={imgSrc} alt={imgAlt} width='640' height='640' objectFit='cover' />
      </div>
      <div className='h-[190px] relative w-full'>
        <div className='h-full bg-white absolute w-full bottom-0 right-0 left-0 will-change-transform z-10 transition-transform hover:-translate-y-20'>
          <a className='block absolute h-[140%] w-full top-0 cursor-pointer'></a>

          <div className='flex flex-col px-6 pb-6 pt-6'>
            <h2 className='text-2xl mb-3 text-ellipsis whitespace-nowrap overflow-hidden font-semibold'>{title}</h2>
            <Link href={collectionUrl || ''}>
              <a className='text-base md:text-lg text-zinc-500 font-semibold hover:text-zinc-900'>
                {collectionTitle}
              </a>
            </Link>
          </div>

          <div className='flex flex-col px-6 pb-6'>

            <div className='flex flex-shrink-0 gap-2 pb-6'>
              <div>
                <div className='mb-2 text-base text-zinc-500 font-semibold'>Current bid</div>
                <div className='text-base text-black font-bold'>{price.toUpperCase()} {symbol.toUpperCase()}</div>
              </div>
            </div>

            <Link href=''>
              <button className='bg-black text-white text-base font-bold w-full min-h-[44px] px-6 rounded-2xl whitespace-nowrap'>Place bid</button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function Home() {

  return (
    <div className='py-16 px-6 lg:pt-24 lg:pb-32 w-full '>

      <div className='flex justify-between pb-4 mb-6 border-b'>
        <div className='flex items-center'>
          <div className='bg-black w-2 h-2 rounded-full' />
          <div className='text-lg md:text-2xl font-bold pl-3'>Trending auctions</div>
        </div>
        <Link href=''>
          <a className='text-base md:text-lg text-zinc-500 font-bold hover:text-zinc-900'>
            View all auctions
          </a>
        </Link>
      </div>

      <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(340px,1fr))] lg:gap-6 xl:gap-8'>
        {dummyCards.map(({ imgSrc, title, collectionTitle, price }) =>
          <Card
            imgSrc={imgSrc}
            title={title}
            collectionTitle={collectionTitle}
            price={price}
            symbol='eth'
          />
        )}
      </div>

    </div>
  )
}
