

describe("NFTMarket", function () {
  it("Should create and execute market sale", async function () {
    // Deploy and get 'NFTMarket' contract address.
    const Market = await ethers.getContractFactory('NFTMarket')
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    // Deploy and get 'NFT' contract address.
    const NFT = await ethers.getContractFactory('NFT')
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    const listingPrice = await market.getListingPrice()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    await nft.createToken('https://media0.giphy.com/media/duzpaTbCUy9Vu/giphy.gif?cid=ecf05e470tj7pgrjk4dellfnm8redpys545p4wkeqczgr60w&rid=giphy.gif&ct=g')
    await nft.createToken('https://media4.giphy.com/media/26gsad5RsZVhKsUDe/giphy.gif?cid=ecf05e470tj7pgrjk4dellfnm8redpys545p4wkeqczgr60w&rid=giphy.gif&ct=g')
    await nft.createToken('https://media4.giphy.com/media/26gsad5RsZVhKsUDe/giphy.gif?cid=ecf05e470tj7pgrjk4dellfnm8redpys545p4wkeqczgr60w&rid=giphy.gif&ct=g')

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 3, auctionPrice, { value: listingPrice })

    const [_, buyerAdress] = await ethers.getSigners()

    await market
      .connect(buyerAdress)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice.toString() })

    const items = await market.fetchUnsoldMarketItems()

    const formattedItems = await Promise.all(items.map(async ({ price, tokenId, seller, owner }) => {
      const tokenURI = await nft.tokenURI(tokenId)
      return {
        price: price.toString(),
        tokenId: tokenId.toString(),
        seller,
        owner,
        tokenURI
      }
    }))

    console.log('unsold market items', formattedItems)

  });
});
