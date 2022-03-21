// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title The contract to handle all marketplace related operations.
 */

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemSold;

    address payable owner;
    uint256 listingPrice = 0.25 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address payable seller,
        address payable owner,
        uint256 price,
        bool sold
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        // We store a new MarketItem to the idToMarketItem mapping at [itemId].
        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        /**
         * @notice The marketplace hold the nft until the sale takes place or is cancelled.
         * It's know as Escrow mechanism.
         * @dev The nftContract ownership is transfered from the msg.sender to this contract.
         */
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;

        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        /**
         * @notice We transfer the money to the seller.
         * At this time, the seller is the one that previously put the NFT on sale in the
         * marketplace. It can be the creator himself or one of the following buyers.
         * @dev We get the current seller address that we've previously stored
         * in the idToMarketItem mapping at the itemId key that the caller pass as argument.
         * Then we call transfer(msg.value) method on it to transfer it the value of the
         * current transaction.
         */
        idToMarketItem[itemId].seller.transfer(msg.value);

        /**
         * @notice We transfer the NFT to the buyer.
         * At this time, the NFT owner is this contract itself since when putting the NFT on sale
         * in the marketplace, the previous owner has transfered ownership to this contract.
         * @dev The nftContract ownership is transfered from this contract to the msg.sender.
         */
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        // We update the owner field of the MarketItem to be the current buyer address.
        idToMarketItem[itemId].owner = payable(msg.sender);

        // We set the sold field of the MarketItem  to true.
        idToMarketItem[itemId].sold = true;

        // We increment the _itemSold counter var by 1.
        _itemSold.increment();

        //We transfer the established fee (listingPrice) to the marketplace (this contract).
        payable(owner).transfer(listingPrice);
    }

    // TODO: Currently work only for the first-sale (Creator sale). Need to implement resale logic.
    // Return an array of the unsold MarketItem to display it in the marketplace.
    function fetchUnsoldMarketItems()
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemSold.current();
        uint256 currentIndex = 0;

        // Instantiate a new in-memory array of the size of unsoldItemsCount.
        MarketItem[] memory items = new MarketItem[](unsoldItemsCount);

        // We loop over the number of item created.
        for (uint256 i = 0; i < itemCount; i++) {
            /*
             * Since we set the owner field to be == to address(0) when
             * we create a new MarketItem by calling the createMarketItem function,
             * we can consider that if the current owner is == address(0), then
             * the item is currently unsold.
             * But that doesn't work for resale... So there is room for improvement.
             */
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    // TODO: Comments.
    function fetchSenderOwnedItems() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        //Get the count of item for which the owner is the sender address.
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        // Instantiate a new in-memory array of the size of itemCount.
        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    // TODO: Comments.
    function fetchSenderListedItems()
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        // Get the count of item for which the seller is the sender address.
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        // Instantiate a new in-memory array of the size of itemCount.
        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
}
