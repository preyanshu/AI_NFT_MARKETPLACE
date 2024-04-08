// 'use client'

import React, { FC, ReactNode } from "react"
import Providers from "./providers";
import { Metadata } from "next";
import Script from "next/script";
import NextNProgress from 'nextjs-progressbar';
import Loadingbar from "./loadingbar";


export const metadata: Metadata = {
    title: 
        "AI NFT Marketplace",
        
    
}

interface Props {
    children?: ReactNode;
}

const RootLayout = async (props: Props) => {
    const { children } = props;

    return (
        <html lang="en">
            <body style={{backgroundColor: "black", color:"white"}}>
            <Loadingbar></Loadingbar>
           
                <Providers>
                    {children}
                </Providers>
                <Script src="https://kit.fontawesome.com/586d61eb04.js" crossOrigin="anonymous"></Script>
            </body>
            
        </html>
    )
}

export default RootLayout