import { ICollectionType, IConfig } from "./lib/app/types";

const CONFIG: IConfig = {
    coinDenom: "uandr",
    name: "AI NFT Marketplace",
    chainId: "messier-1",
    createdDate: "2024-03-31T19:01:01.148Z",
    modifiedDate: "2024-03-31T19:01:01.148Z",
    id: "andromeda",
       collections: [
              
        {
            marketplace:
                "andr1ckz5tdwk95n5g7gdccdqxs92srcl2dm6dusk6lyfe56afrg745cqhquw6a",
            cw721: "andr1367zs8cryps964648emhd2cl3vpukfhvf5e7gqfc0av5va724xzsm9m70l",
            name: "Marketplace Example",
            type: ICollectionType.MARKETPLACE,
            id: "marketplace",
        }
    ],
};

export default CONFIG;
