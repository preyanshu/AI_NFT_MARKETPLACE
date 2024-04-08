import { FC, memo, useEffect, useMemo, useState } from "react";
import { Coin, StdFee } from "@cosmjs/stargate";

import { useGlobalModalContext } from "../hooks";
import { TransactionModalProps } from "../types";

import { Box, Button, Center, Divider, Text } from "@/theme/ui-elements";
import ModalLoading from "./ModalLoading";
import { sumCoins } from "@/lib/andrjs/utils/funds";
import { GasIcon } from "@/modules/common/icons";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
// import { useCurrentChainConfig } from "@/lib/andrjs/hooks/useKeplrChainConfig";
// import { CoinPretty } from "@keplr-wallet/unit";

interface OptionalProps {
  onNextStage?: () => void;
  onPrevStage?: () => void;
  updateFee: (fee: StdFee) => void;
}

const FeeAmount: FC<{ coin: Coin; text: string }> = memo(function FeeAmount({
  coin,
  text,
}) {
  // const chainConfig = useCurrentChainConfig()
  const formattedCoin = useMemo(() => {
    /** Commenting out denom conversion as some conversions, like injective, are not working properly.
     * Will have to look more into keplrs internal hooks to see how they handle denoms.
     * @see: https://github.com/chainapsis/keplr-wallet/blob/master/packages/hooks/src/tx/fee.ts
     */
    return coin
    // const currency = chainConfig?.currencies.find(c => c.coinMinimalDenom === coin.denom);
    // if (!currency) return { ...coin };
    // const keplrCoin = new CoinPretty({
    //   ...currency
    // }, coin.amount)
    // return {
    //   amount: keplrCoin.hideDenom(true).toString(),
    //   denom: keplrCoin.denom
    // }
  }, [coin])
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          position: "relative",
        }}
      >
        <Box>{text}</Box>
        <Box>
          {formattedCoin?.amount}{" "}
          <b>{formattedCoin?.denom} </b>
        </Box>
      </Box>
    </>
  );
});

// Displays EstimateFee Modal (with a condition of (props.simulate && props.onNextStep))
// Repair note from fix/transaction-modal-processing: A bang operator (!) was appended to the props.simulate declaration causing inverse evaluations of the intended conditions
const EstimateFeeModal: FC<TransactionModalProps & OptionalProps> = (props) => {
  console.log("props_final", props.msg[0]);
  const client = useAndromedaClient();
  const { close, setError } = useGlobalModalContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [fee, setFee] = useState<any>({ amount: [], gas: "0" });

  // const totalFunds = useMemo(() => {
  //   const sum = sumCoins([...fee.amount, ...props.funds]);
  //   return sum;
  // }, [fee, props]);

  useEffect(() => {
    const simulateFee = async () => {
      setLoading(true);
      const getFee = (msgitem:any,funditem:any) => {
        console.log("msgitem",msgitem);
        console.log("funditem",funditem);
        console.log("props.contractAddress",props.contractAddress);
        return client!.estimateExecuteFee(
          props.contractAddress,
          msgitem,
          funditem,
        );
      }



      try {

        const msgItems: any = props.msg;
        const fundItems: any = props.funds; // Assuming props.funds is an array of funds corresponding to msgItems
        
        
        // Define an array to hold the promises for fee estimations
        const feePromises: Promise<any>[] = [];
        
        msgItems.forEach((msgItem: any, index: number) => {
          const fundItem = fundItems[index]; // Get the corresponding fund item
        
          // Call getFee to get the fee estimation for the current message item and fund item pair
          const feePromise = getFee(msgItem, fundItem);
        
          // Push the fee promise into the feePromises array
          feePromises.push(feePromise);
        });
        
        try {
          // Use Promise.all to wait for all fee estimations to resolve
          const estimatedFees = await Promise.all(feePromises);
        
          let totalAmount = 0;
          let totalGas = 0;
        
          // Iterate through the estimatedFees array to accumulate total amount and total gas
          estimatedFees.forEach((feeItem) => {
            // Extract amount and gas from the feeItem object
            const amount = parseInt(feeItem.amount[0].amount) || 0; // Convert amount to number (default to 0 if undefined or NaN)
            const gas = parseInt(feeItem.gas) || 0; // Convert gas to number (default to 0 if undefined or NaN)
        
            // Accumulate amount and gas to totals
            totalAmount += amount;
            totalGas += gas;
          });
        
          // Construct the final output object
          const finalOutput = {
            amount: [{ amount: totalAmount.toString(), denom: 'uandr' }],
            gas: totalGas
          };
        
          // Output the final output object
          console.log('Final Output:', finalOutput);
          const estimatedFees2 = finalOutput;
          console.log('Estimated Fees:', estimatedFees2);
 
        // console.log(estimatedFee);
        setFee(estimatedFees2);
        setLoading(false);
        
          // Return or use the finalOutput object as needed in your application logic
        } catch (error) {
          // Handle errors that occur during fee estimation
          console.error('Error estimating fees:', error);
        }

// Log the estimated fees array for debugging purposes

      } catch (error) {
        setError(error as Error);
      }
    };

    const tId = setTimeout(() => {
      simulateFee();
    }, 500);
    console.log("funds_f",props.funds);

    return () => clearTimeout(tId);
  }, [client, props, setError]);

  const flattenedArray = props.funds.flatMap((innerArray:any) => innerArray);

// Use reduce to calculate the total amount
const totalAmount = flattenedArray.reduce((accumulator, currentValue) => {
  // Convert amount from string to number and add to accumulator
  const amount = parseInt(currentValue.amount);
  return accumulator + amount;
}, 0);

  return (
    <Box
      sx={{
        padding: "6px",
        color:"black"
      }}

    >
      {loading ? (
        <ModalLoading title="Simulating">
          <Text
            mt="10px"
            sx={{
              fontWeight: "400",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            We&apos;re simulating your transaction to check for any errors.
            We&apos;ll get back to you with an estimated cost shortly!
          </Text>
        </ModalLoading>
      ) : (
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "50px auto",
              gridGap: "16px",
            }}
          >
            <Center sx={{ alignItems: "flex-start" }}>
              <GasIcon
                height="48px"
                width="48px"
                color="primary.400"
                bgColor="dark.300"
                padding="12px"
                rounded="full"
              />
            </Center>
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                Estimated Fees
              </Text>
              <Text mt="2" fontSize="sm" color="dark.500">
                This is an estimated breakdown of the costs of running your
                transaction.
              </Text>
            </Box>
          </Box>
          <Box
            mt="20px"
            borderRadius='lg'
            borderColor='dark.300'
            borderWidth='1px'
            p='4'
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <Box>Gas Used</Box>
              <Box>{fee.gas}</Box>
            </Box>
            <Divider color='dark.300' />
            {console.log("fee",fee)}
            {fee.amount.map((coin:any, index:any) => (
              <FeeAmount
                key={`feeamount-${index}`}
                coin={coin}
                text="Cost Estimate"
              />
            ))}

<Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          position: "relative",
        }}
      >
        <Box>Fund</Box>
        <Box>
          {totalAmount && <>{totalAmount+" "}</>}
             
          <b>{fee.amount[0].denom} </b>
        </Box>
      </Box>


<Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          position: "relative",
        }}
      >
        <Box>Total</Box>
        <Box>
          {console.log("gas",parseInt(fee.gas))}
          {console.log("amount",parseInt(fee.amount[0].amount))}

          {totalAmount && <>{parseInt(totalAmount) +parseInt(fee.amount[0].amount) +" " }</>}
             
          <b>{fee.amount[0].denom} </b>
        </Box>
      </Box>
            
          </Box>

          <Box
            mt="40px"
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              variant="outline"
              sx={{ fontSize: "16px", padding: "10px 32px" }}
              onClick={close}
            >
              Cancel
            </Button>
            {props.onNextStage && (
              <Button
                variant="solid"
                bg="#7F56D9"
                sx={{
                  marginLeft: "10px",
                  "&:hover": { bg: "#7F56D9" },
                  fontSize: "16px",
                  padding: "10px 32px",
                }}
                onClick={() => {
                  props.updateFee(fee);
                  props.onNextStage?.();
                }}
              >
                Broadcast
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EstimateFeeModal;
