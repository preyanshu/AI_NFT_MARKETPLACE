import { IMarketplaceCollection } from "@/lib/app/types";
import { useGetTokenMarketplaceInfo } from "@/lib/graphql/hooks/marketplace";
import { Box, Button, Flex, Text, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React, { FC, useState, useEffect } from "react";
import { MoreHorizontalIcon } from "@/theme/icons";
import { m } from "framer-motion";

interface Props {
    collection: IMarketplaceCollection;
    tokenId: string;
}

const Cw721MarketplaceState: FC<Props> = ({ collection, tokenId }) => {
    const { data: marketplace } = useGetTokenMarketplaceInfo(collection.marketplace, collection.cw721, tokenId);
    console.log("marketplace", marketplace);
    const [inCart, setInCart] = useState<boolean>(false);


    useEffect(() => {
        // Check if the token is already in the cart when the component mounts
        setInCart(isInCart(tokenId));
    }, [tokenId]);

    // Function to check if an item (token ID) is already in the cart
    // Function to check if a token ID is in the cart
const isInCart = (tokenId: string): boolean => {
    const cartItemsStr = localStorage.getItem('cartItems');
    if (cartItemsStr) {
        const cartItems = JSON.parse(cartItemsStr) as string[];
        return cartItems.includes(tokenId);
    }
    return false;
};

// Function to add an item (token ID) to the cart
const addToCart = (tokenId: string, price: number): void => {
    const cartItemsStr = localStorage.getItem('cartItems');
    const cartItems = cartItemsStr ? JSON.parse(cartItemsStr) as string[] : [];
    const cartItemPricesStr = localStorage.getItem('cartItemPrices');
    const cartItemPrices = cartItemPricesStr ? JSON.parse(cartItemPricesStr) as number[] : [];

    cartItems.push(tokenId);
    cartItemPrices.push(price);

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartItemPrices', JSON.stringify(cartItemPrices));

    setInCart(true); // Update state to reflect item in cart
};

// Function to remove an item (token ID) from the cart
const removeFromCart = (tokenId: string): void => {
    const cartItemsStr = localStorage.getItem('cartItems');
    const cartItemPricesStr = localStorage.getItem('cartItemPrices');
    
    if (cartItemsStr && cartItemPricesStr) {
        const cartItems = JSON.parse(cartItemsStr) as string[];
        const cartItemPrices = JSON.parse(cartItemPricesStr) as number[];

        const index = cartItems.indexOf(tokenId);
        if (index !== -1) {
            cartItems.splice(index, 1); // Remove token ID from cartItems
            cartItemPrices.splice(index, 1); // Remove corresponding price from cartItemPrices

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            localStorage.setItem('cartItemPrices', JSON.stringify(cartItemPrices));

            setInCart(false); // Update state to reflect item not in cart
        }
    }
};

// Handle button click
const handleButtonClick = () => {
    if (marketplace?.latestSaleState.status !== "open") {
        alert("Not for Sale");
        return;
    }

    if (isInCart(tokenId)) {
        // Item is already in cart, so remove it
        removeFromCart(tokenId);
    } else {
        // Item is not in cart, so add it with its price
        const itemPrice : any = marketplace?.latestSaleState.price ?? 0; // Get item price or default to 0
        addToCart(tokenId, itemPrice);
    }
};  

let backgroundColor, textColor;
const status = marketplace?.latestSaleState.status;

  // Determine colors based on the status variable
  if (status === 'open') {
    backgroundColor = '#8ff78f';
    textColor = 'green'; // Text color for green background
  } else if (status === 'executed') {
    backgroundColor = 'rgb(243 178 178)';
    textColor = 'red'; // Text color for red background
  } else if (status === undefined) {
    backgroundColor = 'rgb(122 127 83)';
    textColor = 'yellow'; // Text color for yellow background
  } else {
    backgroundColor = 'white';
    textColor = 'black'; // Default colors if status is unknown
  }


    return (
        <Box>
            <Box mb='1'>
                {/* Display marketplace start stats */}
                {/* Assuming MarketplaceStartStat is a component that displays some marketplace info */}
                <Text>
                <span style={{backgroundColor: backgroundColor, color: textColor, padding: "3px", borderRadius: "5px", margin: "2px"}}>
                {marketplace?.latestSaleState.status === "open" && "For Sale"}
                {marketplace?.latestSaleState.status === "executed" && "Sold Out"}
                {marketplace?.latestSaleState.status === undefined && "Not for Sale"}
                </span>
                </Text>
                <Text>
                    {marketplace?.latestSaleState.price} {marketplace?.latestSaleState.coin_denom}
                    {!marketplace?.latestSaleState.price && "Price Not Set"}
                </Text>
            </Box>
            <Flex justify="space-between" align="start" gap="2">
                <Box>
                    <Button
                        id="addToCartButton"
                        // data-token-id={tokenId}
                        colorScheme={inCart ? "red" : "purple"}
                        size='sm'
                        onClick={handleButtonClick}
                    >
                        {inCart ? 'Remove from Cart' : 'Add to Cart'}
                    </Button>
                </Box>
                <Box>
                    {/* Empty box placeholder */}
                    <>&nbsp;</>
                </Box>
                <Menu placement="bottom-end">
                    <MenuButton
                        as={IconButton}
                        icon={<MoreHorizontalIcon width={16} />}
                        variant="link"
                        alignSelf="end"
                    />
                    <MenuList>
                        <MenuItem>Burn</MenuItem>
                        <MenuItem>Archive</MenuItem>
                        <MenuItem>Sell</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Box>
    );
};

export default Cw721MarketplaceState;
