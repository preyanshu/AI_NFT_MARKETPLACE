import React from 'react'
import { useGetCw721Token } from '@/lib/graphql/hooks/cw721';
import { useGetTokenMarketplaceInfo } from '@/lib/graphql/hooks/marketplace';
import "./tokenstyle.css"



const TokenCard = (props:any) => {
    const {address,item,maddress}=props;
    console.log("pp",props);
    const { data: token } = useGetCw721Token(address, item);
    const { data: marketplace } = useGetTokenMarketplaceInfo(maddress, address, item);
    console.log("token123",marketplace);

    if(!token || !marketplace) {
        return (
            <p>Loading data....</p> 
        )
    }
  return (
    <div style={{marginBottom:"15px",width:"100%",display:"flex"}}>
       <img
  src={token && token.metadata.image ? token.metadata.image : "https://previews.123rf.com/images/vectorv/vectorv1908/vectorv190808641/128589814-black-dead-laptop-icon-isolated-on-black-background-404-error-like-laptop-with-dead-emoji-fatal.jpg"}
  alt=""
  style={{width:"50px",height:"50px",borderRadius:"10px",border:"0px solid #000"}}
/>
<div style={{marginLeft:"15px"}}>
<p>tokenId : {token?.tokenId}</p> 
<p>price : {marketplace?.latestSaleState.price +" " +marketplace?.latestSaleState.coin_denom} </p>
</div>
    
        


      
    </div>
  )
}

export default TokenCard
