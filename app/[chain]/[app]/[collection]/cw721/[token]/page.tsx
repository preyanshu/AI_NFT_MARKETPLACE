"use client";
import { IAuctionCollection, useAppUtils } from "@/lib/app";
import Cw721TokenPage from "@/modules/cw721/token";
import { useCodegenGeneratedAdoCw721NftinfoExtensionQuery } from "@andromedaprotocol/gql/dist/__generated/react";
import { notFound } from 'next/navigation'
import React, { FC } from "react"

interface Props {
    params: {
        collection: string;
        token: string;
    }
}

const Page: FC<Props> = (props) => {
    const { params: { collection: collectionId, token: tokenId } } = props;
    const { getCollection } = useAppUtils();
    const collection = getCollection(collectionId) as IAuctionCollection;
    const { error } = useCodegenGeneratedAdoCw721NftinfoExtensionQuery({
        variables: {
            'ADO_cw721_address': collection.cw721,
            'ADO_cw721_cw721_nftInfo_tokenId': tokenId
        }
    });
    console.log(error, "Error");
    if (error) {
        return notFound()
    }

    return (
        <Cw721TokenPage tokenId={tokenId} collection={collection} contractAddress={collection.cw721} />
    )
}

export default Page