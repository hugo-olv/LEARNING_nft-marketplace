import { Card, Button, BigCard, TwoColSection } from '../components'

export default function Buy() {
    return (
        <TwoColSection>
            <BigCard>
                <h2 className='text-2xl font-bold mb-5 -tracking-[0.01em] lg:text-4xl lg:-tracking-[0.02em]'>Buy Now</h2>
                <div className='text-sm lg:text-base mb-12'>Confirm the transaction to buy the NFT.</div>
                <div className='flex items-start justify-between pt-6 pb-8 border-t'>
                    <span className='text-base text-zinc-500 font-semibold'>Total Price</span>
                    <span className='text-4xl text-black font-semibold -tracking-[0.02em]'>3.00 ETH</span>
                </div>
                <Button text='Confirm' />
            </BigCard>
            <Card collectionTitle='Manic Distopia' buttonDisabled />
        </TwoColSection>
    )
}