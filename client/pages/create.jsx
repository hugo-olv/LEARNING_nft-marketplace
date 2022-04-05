import { useRef, useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants'
import { Card, Button, BigCard, TwoColSection } from '../components'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function Create() {
    const inputFileRef = useRef(null)
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        // uploadedFile: { uri: '', name: '', size: '' },
    })
    const [uploadedImage, setUploadedImage] = useState({ uri: '', name: '', size: '' })
    const [file, setFile] = useState(null)
    // const [ipfsURL, setIpfsURL] = useState('')
    const [isFormValid, setIsFormValid] = useState(false)

    const router = useRouter()

    const fee = 5

    // Check if the form is valid and set state accordingly.
    useEffect(() => {
        const { title, price } = formData
        if (title
            && price
            && file
            && price >= 0.275) setIsFormValid(true)
        else setIsFormValid(false)
    }, [formData])

    const buttonText = useMemo(({ title, price } = formData) => {
        if ((price.length) > 0 && (price < 0.275)) return 'Must be at least 0.275 ETH'
        if (title
            && price
            && file) return 'Mint and List'
        else return 'Required field'
    }, [formData])

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleFilesChange = e => {
        const targetFile = e.target.files[0]
        if (targetFile) {
            const reader = new FileReader()
            reader.readAsDataURL(e.target.files[0])
            reader.onload = e => {
                const uri = e.target.result
                const { name, size } = targetFile
                setUploadedImage(({ uri, name, size }))
                setFile(targetFile)
                console.log('imageURI', uri)
                console.log('targetFile', targetFile)
            }
        }
    }

    const handleInputFileClick = () => {
        inputFileRef.current.click()
    }

    const handleSubmit = async () => {
        try {
            if (!isFormValid) return
            const addedImage = await client.add(
                file,
                {
                    progress: prog => console.log(`received: ${prog}`)
                })
            const imageURL = `https://ipfs.infura.io/ipfs/${addedImage.path}`
            const medataData = JSON.stringify({ ...formData, image: imageURL })
            const addedMeta = await client.add(medataData)
            const metaURL = `https://ipfs.infura.io/ipfs/${addedMeta.path}`
            // after file is uploaded to IPFS, we pass the URL to save it on Polygon.
            createSale(metaURL)

            console.log(medataData)
        } catch (e) {
            console.log(e)
        }
    }

    const createSale = async (tokenURL) => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const nftContract = new ethers.Contract(CONTRACT_ADDRESS.nft, CONTRACT_ABI.nft, signer)
        const nftTransaction = await nftContract.createToken(tokenURL)
        const nftTx = await nftTransaction.wait()

        let event = nftTx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()

        const price = ethers.utils.parseUnits(formData.price, 'ether')

        const marketContract = new ethers.Contract(CONTRACT_ADDRESS.market, CONTRACT_ABI.market, signer)
        let listingPrice = await marketContract.getListingPrice()
        listingPrice = listingPrice.toString()
        const marketTransaction = await marketContract.createMarketItem(
            CONTRACT_ADDRESS.nft,
            tokenId,
            price,
            { value: listingPrice }
        )
        await marketTransaction.wait()
        console.log('transaction succesfull')
    }

    return (
        <TwoColSection>
            <BigCard>
                <h2 className='text-2xl font-bold mb-12 -tracking-[0.01em] lg:text-4xl lg:-tracking-[0.02em]'>Mint and List an NFT</h2>
                <h3 className='text-lg lg:text-2xl font-bold mb-4'>Add Details</h3>
                <div className='text-sm lg:text-base mb-12'>Once your NFT is minted to the Ethereum blockchain, you will bot be able to edit or update any of it's information.</div>
                <form>
                    <div className='flex flex-col'>

                        {/* Title */}
                        <label htmlFor="title" className='text-base font-medium mb-2'>Title</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            name="title"
                            placeholder="Vision.2"
                            autoFocus
                            className='mb-10 h-14 px-4 py-3 text-base border-4 border-transparent focus:border-black outline-none rounded-lg' />

                        {/* Description */}
                        <label htmlFor="description" className='text-base font-medium mb-2'>Description</label>
                        <textarea
                            onChange={handleChange}
                            type="text"
                            name="description"
                            className='resize-none mb-10 h-32 px-4 py-3 text-base border-4 border-transparent focus:border-black outline-none rounded-lg' />

                        {/* Files */}
                        <label htmlFor="file" className='text-base font-medium mb-2'>Add Image</label>
                        <div
                            onClick={handleInputFileClick}
                            className='file block p-4 hover:bg-[#f9f9f9] hover:border-gray-300 mb-10 cursor-pointer text-base border-2 border-dashed rounded-lg'>
                            <input ref={inputFileRef} onChange={handleFilesChange} accept="image/*" type="file" name="file" hidden />

                            {!uploadedImage.uri ? (
                                <div className='flex flex-col items-center justify-center w-full h-32'>
                                    <div className='text-xs font-medium mb-2 bg-[#E6E6E6] px-2 py-1 rounded-md'>Add file</div>
                                    <div className='text-sm text-gray-600'>Accept .jpg and .png </div>
                                </div>
                            ) : (
                                <div className='flex items-center gap-3'>
                                    <img src={uploadedImage.uri} alt="uploaded image" className='h-8' />
                                    <div className='grid grid-rows-2 w-full'>
                                        <div className='text-sm text-ellipsis whitespace-nowrap overflow-hidden'>{uploadedImage.name}</div>
                                        <div className='text-xs text-gray-600'>{uploadedImage.size / 1000} kB</div>
                                    </div>
                                </div>
                            )}

                        </div>

                        <h3 className='text-lg lg:text-2xl font-bold mb-4'>Set a Buy Now price</h3>
                        <div className='text-sm lg:text-base mb-12'>Buyer will be able to instantky buy the NFT. You may edit this price at any time.</div>

                        {/* Price */}
                        <label htmlFor='price' className='text-lg font-bold mb-3'>Buy Now Price</label>
                        <div className='price flex w-full rounded-xl rounded-l-[20px] bg-black overflow-visible'>
                            <div>
                                <input
                                    onChange={handleChange}
                                    onWheel={e => e.target.blur()}
                                    type='number'
                                    step='any'
                                    inputMode='decimal'
                                    name='price'
                                    placeholder='0'
                                    className='w-full font-mono text-black text-xl font-medium sm:text-[50px] placeholder:text-gray-300 min-h-[56px] sm:min-h-[70px] px-4 border-4 border-transparent rounded-xl focus:border-4 focus:border-black focus:outline-none' />
                            </div>
                            <div className='flex flex-shrink-0 items-center px-4'>
                                <div className='-top-[2px] relative mr-[10px] text-lg sm:text-4xl sm:-tracking-wide font-semibold text-white'>ETH</div>
                                <svg viewBox="0 0 18 27" fill="none" xmlns="http://www.w3.org/2000/svg" css="[object Object]" width="18" height="27"><path d="M18 14.914 9.317 18.13.635 14.914 9.317.004 18 14.914Z" fill="#fff">
                                </path><path d="m17.62 16.706-8.303 9.716-8.303-9.716 8.303 3.075 8.303-3.075Z" fill="#fff" fillOpacity="0.74"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Marketplace FEE */}
                        <div className='flex flex-col mt-4 mb-12'>
                            <div className='flex items-start justify-between border-b pb-3 mb-2'>
                                <span className='text-base text-zinc-500 font-semibold'>Marketplace fee</span>
                                <div className='flex flex-col items-end'>
                                    <span className='text-base font-bold -tracking-wide'>{(formData.price * fee / 100).toFixed(4)} ETH</span>
                                    <span className='text-sm text-zinc-500 font-medium'>{fee}%</span>
                                </div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='text-base font-bold'>You'll receive</span>
                                <span className='text-xl font-bold -tracking-wide'>{(formData.price - (formData.price / 100 * fee)).toFixed(4)} ETH</span>
                            </div>
                        </div>

                    </div>
                </form>

                <Button onClick={handleSubmit} text={buttonText} disabled={!isFormValid} />
            </BigCard>
            <div className='sticky top-12'>
                <Card
                    imgUri={uploadedImage.uri || null}
                    title={formData.title || 'Title'}
                    collectionTitle='Manic Distopia'
                    buttonDisabled
                    disabled
                />
            </div>
        </TwoColSection>
    )
}