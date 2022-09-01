import React from 'react';

const CTabPanel = (props) => {
    const {
        children,
        value,
        index,
        ...other
    } = props;

    return (
        <div 
            role="tabpanel"
            hidden={value !== index}
            id={`ctabpanel-${index}`}
            className="tabPanel"
            {...other}
        >
            {value === index && (
                <>{children}</>
            )}
        </div>
    );
};

export { CTabPanel };
