import { Text, Box, Center, Button } from "@chakra-ui/react";
import { Check, ExternalLink } from "lucide-react";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { useGlobalModalContext } from "../hooks";
import { TransactionModalProps } from "../types";
import ModalLoading from "./ModalLoading";
import type {
  ExecuteResult,
  InstantiateResult,
} from "@cosmjs/cosmwasm-stargate";
import { truncate } from "@/utils/text";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import { useAndromedaStore } from "@/zustand/andromeda";
import useQueryChain from "@/lib/graphql/hooks/chain/useChainConfig";

interface OptionalProps {
  onNextStage?: () => void;
}

const BroadcastingModal: FC<TransactionModalProps & OptionalProps & any> = memo(
  function BroadcastingModal(props) {
    const [loading, setLoading] = useState<boolean>(true);
    const client = useAndromedaClient();
    const { chainId } = useAndromedaStore();
    const { data: chainConfig } = useQueryChain(chainId);
    const { close, setError } = useGlobalModalContext();
    const [result, setResult] = useState<
      ExecuteResult | InstantiateResult | undefined
    >();

    const broadcast = useCallback(async () => {
      // console.log("props_sp",)

      const messages = props.msg; 

// Define a function to create an object using client!.chainClient?.encodeExecuteMsg
const createEncodedObject = (contractAddress: string, msg: any, funds: any): any => {
  // Use client!.chainClient?.encodeExecuteMsg to encode the execute message
  return client!.chainClient?.encodeExecuteMsg(contractAddress, msg, funds);
};

      const encodedObjects = messages.map((messageItem:any,index:any) => {
        const msg= messageItem; // Destructure msg and funds from each message item
        return createEncodedObject(props.contractAddress, msg, props.funds[index]);
      });
    
      

      
      console.log("Encoded Object___", encodedObjects);
      console.log("Broadcasting__props", props)
      return client!.signAndBroadcast(
        encodedObjects,"auto",props.memo
        // Here props fee can be used to set gas price from the estimated result. However gas price calculated is low so using auto till its fixed
        
      );
    }, [props, client]);


    useEffect(() => {
      const broadcastTx = async () => {
        setLoading(true);
        try {
          const resp: ExecuteResult | InstantiateResult|any = await broadcast();
          setResult(resp);
          setLoading(false);
          if (props.onNextStage) props.onNextStage();
        } catch (_error) {
          setError(_error as Error);
          console.log(_error);
        }
      };

      const tId = setTimeout(() => {
        if (!result) broadcastTx();
      }, 500);

      return () => clearTimeout(tId);
    }, [broadcast, setError, props, result]);

    console.log(result, "Result");

    const TransactionInfo = useMemo(() => {
      if (!result) return <></>;
      const { transactionHash } = result as ExecuteResult | InstantiateResult;

     

      return (
        <Box
          sx={{
            border: "1px solid #D0D5DD",
            borderRadius: "12px",
            padding: "16px",
            width: "100%",
            fontSize: "14px",
            color:"black"
          }}
          mt="40px"
        >
          <Text sx={{ fontWeight: "bold",color:"black" }}>Transaction #</Text>
          <Text mt="6px" style={{ color: "#7F56D9" }}>
            <a
              href={
                chainConfig?.blockExplorerTxPages[0]?.replaceAll(
                  "${txHash}",
                  transactionHash
                ) ?? ""
              }
              target="_blank"
              rel="noreferrer noopener"
            >
              {truncate(transactionHash)}{" "}
              <ExternalLink style={{ display: "inline-block" }} size="14px" />
            </a>
          </Text>
        </Box>
      );
    }, [props, result]);

    return (
      <Box
        sx={{
          padding: "6px",
        }}
      >
        {loading ? (
          <ModalLoading title="Broadcasting Your Transaction">
            {/* <Text
              mt="10px"
              sx={{
                fontWeight: "400",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              Your transaction is being broadcasted!
            </Text> */}
          </ModalLoading>
        ) : (
          <>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: "20px",
                color:"black"
              }}
            >
              <Check
                style={{
                  width: "100px",
                  height: "100px",
                  fontSize: "60px",
                  color: "#7F56D9",
                }}
              />
              <Text mt="60px" sx={{ textAlign: "center", fontWeight: "bold" }}>
                Transaction Successful!
              </Text>

              {TransactionInfo}
              <Center>
                <Button
                  mt="40px"
                  variant="outline"
                  sx={{ fontSize: "16px", padding: "10px 32px",color:"black" }}
                  onClick={close}
                  
                >
                  Close
                </Button>
              </Center>
            </Box>
          </>
        )}
      </Box>
    );
  }
);

export default BroadcastingModal;
