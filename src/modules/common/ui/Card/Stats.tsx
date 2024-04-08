import { Box, Text } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react"

interface Props {
    title: string;
    tokenId: string;
}

const CardStats: FC<Props> = (props) => {
    const { title, tokenId } = props;
    return (
        <Box>
            <Text fontSize="xs" textStyle="light">
                {title}
            </Text>
            <Text fontWeight="medium" fontSize="xs">
                {tokenId}
            </Text>
        </Box>
    )
}

export default CardStats