import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { FC, useState, useEffect } from "react";
import { CollectionDropdown, ConnectWallet } from "@/modules/common/cta";
import useApp from "@/lib/app/hooks/useApp";
import Link from "next/link";
import { LINKS } from "@/utils/links";
import { setInterval } from "timers";
// import tokenCard from "./TokenCard";
import TokenCard from "./TokenCard";
import useBuyNowModal from "@/modules/modals/hooks/useBuyNowModal";


interface NavbarProps {}
const Navbar: FC<NavbarProps> = (props) => {
  const {} = props;
  const { config } = useApp();
  // console.log("C",config);
  const address: any = (config.collections[0] as any).cw721;
  const maddress: any = (config.collections[0] as any).marketplace;
  // console.log("address",address);

  const [showModal, setShowModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const open = useBuyNowModal({ marketplaceAddress:maddress, contractAddress:address, tokenId:JSON.parse(localStorage.getItem('cartItems') as any),totalCartPrice:JSON.parse(localStorage.getItem('cartItemPrices') as any) } as any);

  useEffect(() => {
    // Fetch cart items from localStorage on component mount
    setInterval(()=>{
      const storedCartItems = localStorage.getItem('cartItems');
    
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }

    }, 1000)
   
    // console.log(cartItems.length);
  },[]);

  const openModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Box py="2" px="8">
      <Flex
        direction="row"
        alignItems="center"
        maxW="container.lg"
        mx="auto"
        gap="4"
      >
       
        <Link href={LINKS.home()} passHref>
          <Text as="a" fontSize="lg" fontWeight="bold">
            {config.name}
          </Text>
        </Link>
        <Flex direction="row" ml="auto" gap="2">
          {/* <CollectionDropdown /> */}

          <i className="fa-solid fa-cart-shopping" onClick={
            openModal
          } style={{ cursor: "pointer", margin: "20px",marginRight:"40px" }}>
           <span style={{marginLeft:"10px"}}> {cartItems.length}</span>
          </i>
          <ConnectWallet />
        </Flex>
        {
         showModal && 
          <div style={{color: "black"}}>
              <div className="modal" >
                <div className="modal-content">
                  <span className="close" onClick={() => {setShowModal(prev=>!prev)}}>&times;</span>
                  <h2 style={{color: "purple"}}>Cart Items</h2>

                  <div>
                    {cartItems.length === 0 && <p>No items in cart</p>}
                    {cartItems.map((item, index) => (
                      <>
                      
                      <TokenCard item={item}  address={address} maddress={maddress}></TokenCard>
                      </>
                    ))}
                  </div>
                  <Button style={{marginTop: "10px" , textAlign: "center", width: "100%"}} colorScheme='purple' size='sm' onClick={()=>{
                    open();
                    setShowModal(false);

                  }}>
                    Checkout
                  </Button>
                </div>
              </div>
            <style jsx>{`
              .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index:+10000000
              }

              .modal-content {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                width: 300px;
                overflow: auto;
              }

              .close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
              }
            `}</style>
          </div>
        }
      </Flex>
    </Box>
  );
};
export default Navbar;
