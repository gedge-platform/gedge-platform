import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { CButton } from "@/components/buttons";

const FileLabel = styled.label`
  display: flex;
  justify-content: space-between;
  .input_file {
    display: none
  }
  &.small {
    .btn_common {
      min-width: 65px
    }
  }
`;

const CFileField = (props) => {
    const {
        id,
        name,
        className,
        style,
        buttonText = "파일 업로드",
        ...other
    } = props;
    const [filename, setFilename] = useState('');
    const fileRef = useRef(null);

    const handleClick = () => {
        fileRef.current.click();
    };
    const handleChange = (event) => {
        setFilename(event.target.files[0].name);
    };

    return (
        <FileLabel
            for={id}
            className={`inputWrap_btns ${className}`}
        >
            <CButton
                type="tertiary"
                onClick={handleClick}
            >
                {buttonText}
            </CButton>
            <input
                id={id}
                type="file"
                ref={fileRef}
                onChange={handleChange}
                className="input_file"
            />
            <input
                type="text"
                value={filename}
                readOnly="readOnly"
                className="input_text"
            />
        </FileLabel>
    );
};

export { CFileField };
