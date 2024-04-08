import { useBuyNowConstruct } from "@/lib/andrjs";
import useApp from "@/lib/app/hooks/useApp";
import {
  Box,
  Button,
  FormControl,
  Heading,
  Text,
} from "@chakra-ui/react";
import { coins } from "@cosmjs/proto-signing";
import { FC, useState } from "react";
import { useExecuteModal } from "../hooks";
import { BuyNowModalProps } from "../types";
import { Msg } from "@andromedaprotocol/andromeda.js";
import { useGetTokenMarketplaceInfo } from "@/lib/graphql/hooks/marketplace";
import { useGetCw721Token } from "@/lib/graphql/hooks/cw721";

const BuyNowModal: FC<BuyNowModalProps>|any = (props:any) => {
  const { contractAddress, tokenId, marketplaceAddress ,totalCartPrice} = props;
  const { data: token } = useGetCw721Token(contractAddress, tokenId);
  const { data: marketplaceState } = useGetTokenMarketplaceInfo(
    marketplaceAddress,
    contractAddress,
    tokenId
  );


  const { config } = useApp();
  const construct = useBuyNowConstruct();

  const DENOM = marketplaceState?.latestSaleState.coin_denom ?? config?.coinDenom ?? "ujunox";

  // Execute place bid directly on auction
  const openExecute = useExecuteModal(marketplaceAddress);


  function constructMessage(contractAddress: string, tokenId: string): any {
    // Construct message object based on your requirements
    return construct({ tokenAddress: contractAddress, tokenId: tokenId });
  }
  
  // Function to prepare funds (coins) based on the marketplace state and token price
  // function prepareFunds(price: number, denom: string): Coin[] {
  //   const fundsAmount = price ?? 0; // Use marketplace price or default to 0 if price is undefined
  //   return coins(fundsAmount, denom);
  // }
  
  // Assuming `tokenIds` is an array of token identifiers (strings)
  const tokenIds: string[] = ['token1', 'token2', 'token3']; // Example token IDs
  
  // Array to store constructed messages for each token ID
  
  
  // Construct messages for each token ID
 

  const onSubmit = () => {
    // const msg = construct({ tokenAddress: contractAddress, tokenId: tokenId });
    const msg: any[] = [];
    for (const t of tokenId) {
      const msg1 = constructMessage(contractAddress, t);
      msg.push(msg1);
    }





    // console.log("price:", marketplaceState?.latestSaleState.price);
    // console.log(JSON.stringify(msg));
    // console.log("DENOM:", DENOM);
    let funds: any[] = [];

    const marketplacePrice = marketplaceState?.latestSaleState.price;
    
    if (Array.isArray(totalCartPrice) && totalCartPrice.length > 0) {
      // Use totalCartPrice if it's available and is an array of prices
      funds = totalCartPrice.map((price) => coins(price, DENOM));
    } else if (marketplacePrice !== undefined) {
      // Use marketplacePrice if totalCartPrice is not available but marketplace price is available
      funds.push(coins(marketplacePrice, DENOM));
    } else {
      // Use the default value (0) if both totalCartPrice and marketplace price are undefined
      funds.push(coins(0, DENOM));
    }
    console.log("funds:", funds);
    console.log("messages:", msg);
    openExecute(msg as any, true, funds);
    
  };

  return (
    <Box>
      <Heading size="md" mb="6" fontWeight="bold" style={{color:"black"}}>
        Purchase
      </Heading>
      <Text textStyle="light" mb="4">
        Do you really want to buy?.

      </Text>
      <Box>
        <FormControl>

          <Button onClick={()=>{
             if(true){
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartItemPrices");
      }
            onSubmit();
          
          }} w="full" mt="6" variant="solid">
            Checkout
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default BuyNowModal;


