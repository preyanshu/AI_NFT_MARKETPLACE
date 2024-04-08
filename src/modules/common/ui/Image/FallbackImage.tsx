import { Image, ImageProps } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react"

interface Props extends ImageProps {
}

const FallbackImage: FC<Props> = (props) => {
    return (
        <Image style={{height : "200px",width:"100%"}} fallbackSrc="https://previews.123rf.com/images/vectorv/vectorv1908/vectorv190808641/128589814-black-dead-laptop-icon-isolated-on-black-background-404-error-like-laptop-with-dead-emoji-fatal.jpg" alt="Image" {...props} />
    )
}

export default FallbackImage