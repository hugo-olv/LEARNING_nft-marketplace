import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Navlink = ({ href, name, mobile }) => {
    const router = useRouter()
    const isActive = router.asPath === href

    const styles = {
        desktop: active =>
            `mr-8 last:mr-0 text-lg ${active ? 'text-black' : 'text-zinc-500'} font-bold hover:text-zinc-900`,
        mobile:
            'text-4xl text-black font-bold leading-tight'
    }

    return (
        <Link href={href}>
            <a className={mobile ? styles.mobile : styles.desktop(isActive)}>
                {name}
            </a>
        </Link>
    )
}

export const Layout = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const router = useRouter()

    // TODO: Rename these const appropriatly.
    const specialView = ['/create', '/buy']
    const isSpecialView = specialView.some(path => path === router.pathname)

    const toggleMenuOpen = () => {
        setMenuOpen(prevState => !prevState)
    }

    useEffect(() => {
        const body = document.querySelector('body')

        // Prevent vertical scrolling when menu is open.
        menuOpen ? body.style.overflow = 'hidden' : body.style.overflow = ''

        // Close mobile menu on route change.
        const handleRouteChange = () => menuOpen && setMenuOpen(false)

        router.events.on('routeChangeStart', handleRouteChange)

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
            router.events.off('routeChangeStart', handleRouteChange)
        }
    }, [menuOpen])

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
        },
        {
            name: 'Create',
            href: '/create'
        }
    ]


    return (
        <div className={`max-w-[1600px] mx-auto w-full h-screen ${isSpecialView ? 'bg-[#F2F2F2]' : 'bg-white'}`}>
            <div>
                {/* Mobile Menu */}
                {menuOpen &&
                    <div className='z-50 fixed px-6 pt-24 bg-white h-screen w-full top-0 left-0'>
                        <div className='flex flex-col'>
                            {links.map(({ name, href }, idx) =>
                                <Navlink
                                    key={idx}
                                    href={href}
                                    name={name}
                                    mobile
                                />)}
                        </div>
                    </div>
                }

                {/* Header */}
                <div className="z-50 flex relative p-6 justify-between">
                    <Link href="/">
                        <a className='h-12 w-12 sm:h-16 sm:w-16'>
                            <Image src='/cdl_logo.svg' alt="logo" width="64" height="64" />
                        </a>
                    </Link>
                    <div className='flex items-center'>
                        {/* Desktop navlinks */}
                        {!isSpecialView &&
                            <div className="hidden lg:flex items-center">
                                {links.map(({ name, href }, idx) => {
                                    if (name === 'Create') return
                                    return <Navlink key={idx} href={href} name={name} />
                                })}
                            </div>}
                        {/* Desktop create button */}
                        {!isSpecialView &&
                            <div className='hidden lg:block'>
                                <Link href={links[3].href}>
                                    <button className={styles.button}>{links[3].name}</button>
                                </Link>
                            </div>}
                        {/* Mobile hamburger button */}
                        {!isSpecialView &&
                            <button
                                onClick={toggleMenuOpen}
                                className='active:scale-95 transition-transform touch-manipulation flex lg:hidden items-center justify-center shrink-0 rounded-full shadow-xl text-black bg-white min-h-[54px] min-w-[54px] cursor-pointer'
                            >
                                {!menuOpen ? (
                                    <svg className="block" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="16"><path d="M1 8h22M1 1h22M1 15h22" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"></path></svg>
                                ) : (
                                    <svg className="block" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M15 1 1 15M15 15 1 1" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                )}

                            </button>}

                    </div>
                </div>

            </div>
            {children}
        </div>
    )
}