import Image from 'next/image'
import Link from 'next/link'

const Navlink = ({ href, name }) => {
    return (
        <Link href={href}>
            <a className='mr-8 last:mr-0 text-lg text-zinc-500 font-bold hover:text-zinc-900'>
                {name}
            </a>
        </Link>
    )
}

export const Layout = ({ children }) => {
    const styles = {
        wrapper: '',
        button: 'bg-black text-white text-lg font-bold px-6 pb-1 h-14 ml-6 rounded-full transition-transform hover:-translate-y-[2px]'
    }

    const links = [
        {
            name: 'Explore',
            href: '/explore'
        },
        {
            name: 'Sell',
            href: '/sell'
        },
        {
            name: 'My NFTs',
            href: '/my-nfts'
        }
    ]

    return (
        <div className='max-w-[1600px] mx-auto'>
            <div className="flex p-6 justify-between">
                <Link href="/">
                    <a>
                        <Image src='/cdl_logo.svg' alt="logo" width="64" height="64" />
                    </a>
                </Link>
                <div className='hidden lg:flex items-center'>
                    <div className="flex items-center">
                        {links.map(({ name, href }, idx) => <Navlink key={idx} href={href} name={name} />)}
                    </div>
                    <Link href="/create">
                        <button className={styles.button}>Create</button>
                    </Link>
                </div>
            </div>
            {children}
        </div>
    )
}