import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { CIconButton } from "@/components/buttons";

const useStyle = makeStyles(() =>
  createStyles({
    root: {
      margin: 0,
      "& .btn_icon": { order: 10 },
      "& .MuiInputBase-root": {
        padding: 0,
        fontFamily: "inherit",
        "&.Mui-focused": {
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
            borderRadius: "4px",
          },
        },
      },
      "& .MuiInputBase-input": {
        height: 32,
        padding: "5px 11px",
        color: "#626b7a",
        fontSize: "12px",
        boxSizing: "border-box",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        padding: "0 !important",
        border: "1px solid #c5cad0",
        borderRadius: "2px",
      },
    },
  }),
);

const CTextField = props => {
  const {
    id,
    name,
    type,
    value,
    label,
    placeholder,
    variant = "outlined",
    margin = "dense",
    className,
    style,
    required,
    rows = 0,
    clearable,
    disabled,
    inputProps,
    onKeyPress,
    onInput,
    onClick,
    ...other
  } = props;
  const classes = useStyle();
  const [tvalue, setTvalue] = useState(value);
  const [multiline, setMultiline] = useState(false);
  const [errorFlag, setErrorFlag] = useState(false);

  useEffect(() => {
    if (Number(rows) > 1) {
      setMultiline(true);
    } else {
      setMultiline(false);
    }
  }, [rows]);

  useEffect(() => {
    handleCheckError(value);
    setTvalue(value);
  }, [value]);

  const handleClear = () => {
    props.onClear && props.onClear();
  };
  const handleChange = e => {
    if (type === "number") {
      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.-]/g, "");
    }

    props.onChange && props.onChange(e);

    handleCheckError(e.currentTarget.value);
    setTvalue(e.currentTarget.value);
  };
  const handleCheckError = value => {
    if (required) {
      if (!value) {
        setErrorFlag(true);
      } else {
        setErrorFlag(false);
      }
    }
  };

  return (
    <TextField
      error={errorFlag}
      id={id}
      name={name}
      value={tvalue}
      type={type}
      label={label}
      disabled={disabled}
      placeholder={placeholder}
      variant={variant}
      margin={margin}
      className={`${classes.root} ${className}`}
      style={style}
      multiline={multiline}
      rows={rows}
      inputProps={inputProps}
      onChange={handleChange}
      onKeyPress={onKeyPress}
      InputProps={{
        startAdornment: (clearable && <CIconButton icon="del" onClick={() => handleClear()} />) || undefined,
      }}
      onInput={onInput}
      onClick={onClick}
    />
  );
};

export { CTextField };
