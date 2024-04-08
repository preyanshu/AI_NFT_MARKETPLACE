import { useGetCollection } from "@/lib/app/hooks/useGetCollection";
import { ICollectionType } from "@/lib/app/types";
import CrowdfundPage from "@/modules/crowdfund/CrowdfundPage";
import ExchangePage from "@/modules/exchange/ExchangePage";
import Cw721Page from "@/modules/cw721/components";
import React, { FC, ReactNode, useMemo } from "react"

interface Props {
    collectionId: string;
}

const CollectionRouter: FC<Props> = (props) => {
    const { collectionId } = props;
    const collection : any = useGetCollection(collectionId);
    return <Cw721Page collection={collection} contractAddress={collection.cw721} />
    // return null;
}

export default CollectionRouter