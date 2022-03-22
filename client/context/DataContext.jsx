import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants'

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
    const [nfts, setNfts] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        loadNFTs()
    }, [])

    const loadNFTs = async () => {
        const provider = new ethers.providers.JsonRpcProvider()
        const tokenContract = new ethers.Contract(CONTRACT_ADDRESS.nft, CONTRACT_ABI.nft, provider)
        const marketContract = new ethers.Contract(CONTRACT_ADDRESS.market, CONTRACT_ABI.market, provider)
        // Method coming from our NFTMarket contract through the ABI.
        const data = await marketContract.fetchUnsoldMarketItems()

        const items = await Promise.all(data.map(async ({ tokenId, price, seller, owner }) => {
            const tokenURI = await tokenContract.tokenURI(tokenId)
            const meta = await axios.get(tokenURI)
            const formattedPrice = ethers.utils.formatUnits(price.toString(), 'ether')

            return {
                price: formattedPrice,
                seller,
                owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description
            }
        }))

        setNfts(items)
        setLoaded(true)
    }

    const buyNft = async (nft) => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = ethers.providers.Web3Provider(connection)

        const signer = provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS.market, CONTRACT_ABI.market.abi, signer)

        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

        const transaction = await contract.createMarketSale(CONTRACT_ADDRESS.nft, nft.tokendId, {
            value: price,
        })
        await transaction.wait()
        loadNFTs()
    }

    return (
        <DataContext.Provider value={{
            loadNFTs,
            nfts,
            loaded
        }}>
            {children}
        </DataContext.Provider>
    )
}
