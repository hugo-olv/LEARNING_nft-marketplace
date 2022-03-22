import Image from 'next/image'
import Link from 'next/link'

export const Card = ({
    imgSrc = 'https://f8n-production-collection-assets.imgix.net/0x7bD33f9DfBCe127EAD20E69971359A2cF8A1a075/8/nft.png',
    imgAlt = 'NFT media',
    title = 'Title',
    URL = '',
    collectionURL = '',
    collectionTitle = '',
    priceSubText = 'Current bid',
    buttonText = 'Place bid',
    price = '1',
    symbol = 'ETH'
}) => {

    const styles = {
        title: hasMb =>
            `text-2xl ${hasMb && 'mb-3'} text-ellipsis whitespace-nowrap overflow-hidden font-semibold`
    }

    return (
        <div className='flex flex-col flex-auto relative sm:min-w-[340px] rounded-lg shadow-md overflow-hidden'>
            <a href={URL} className='absolute top-0 left-0 w-full h-full z-10'></a>
            <div className='block relative'>
                <Image
                    priority
                    layout="intrinsic"
                    src={imgSrc}
                    alt={imgAlt}
                    width={640}
                    height={640}
                    objectFit='cover' />
            </div>
            <div className='z-20 block relative w-full -mb-[72px]'>
                <div className='h-full bg-white w-full will-change-transform z-10 transition-transform sm:hover:-translate-y-[72px]'>
                    <a href={URL} className='block absolute h-[140%] w-full top-0 cursor-pointer'></a>

                    <div className='flex flex-col px-6 pb-6 pt-6'>
                        <h2 className={styles.title(collectionTitle)}>{title}</h2>
                        {collectionTitle && <Link href={collectionURL}>
                            <a className='z-10 mr-auto text-base md:text-lg text-zinc-500 font-semibold hover:text-zinc-900'>
                                {collectionTitle}
                            </a>
                        </Link>}
                    </div>

                    <div className='flex flex-col px-6 pb-6'>

                        <div className='flex flex-shrink-0 gap-2 pb-6'>
                            <div>
                                <div className='mb-2 text-base text-zinc-500 font-semibold'>{priceSubText}</div>
                                <div className='text-base text-black font-bold'>{price.toUpperCase()} {symbol.toUpperCase()}</div>
                            </div>
                        </div>
                        <button className='bg-black text-white text-base font-bold w-full min-h-[44px] px-6 rounded-2xl whitespace-nowrap'>
                            {buttonText}
                        </button>
                    </div>

                </div>
            </div>
        </div >
    )
}