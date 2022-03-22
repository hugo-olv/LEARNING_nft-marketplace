import Link from 'next/link'

export function GridSection({ title, linkName, linkURL, ping, children }) {

    return (
        <div className='py-16 px-6 lg:pt-24 lg:pb-32 w-full '>

            <div className='flex justify-between pb-4 mb-6 border-b'>
                <div className='flex items-center'>
                    {ping && <div className='flex items-center justify-center relative w-[18px] h-[18px]'>
                        <div className='animate-ping origin-center bg-black w-3 h-3 rounded-full' />
                        <div className='absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 bg-black w-2 h-2 rounded-full' />
                    </div>}
                    <div className='text-lg md:text-2xl font-bold pl-3'>{title}</div>
                </div>
                <Link href={linkURL || ''}>
                    <a className='flex items-center text-base md:text-lg text-zinc-500 font-bold hover:text-zinc-900'>
                        {linkName}
                    </a>
                </Link>
            </div>

            <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] lg:gap-6 xl:gap-8'>
                {children}
            </div>

        </div>
    )
}