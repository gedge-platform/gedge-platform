import React from 'react';
import styled from 'styled-components';
import theme from '@/styles/theme';
import { CDragSizing } from "@/components/dragsizing";

const ContArea = styled.div`
  
`;

const DetailContents = (props) => {
    return (
        <CDragSizing>
            {props.children}
        </CDragSizing>
    )
};

export { DetailContents };
