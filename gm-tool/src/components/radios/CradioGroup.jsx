import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup, { RadioGroupProps } from '@material-ui/core/RadioGroup';
import FormControlLabel, { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexDirection: 'row',
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },
        cradio1: {
            '&$checked': {
                // color: theme.palette.success.main,
            },
        },
        cradio2: {
            '&$checked': {
                // color: theme.palette.info.main,
            },
        },
        cradio3: {
            '&$checked': {
                // color: theme.palette.warning.main,
            },
        },
        cradio4: {
            '&$checked': {
                // color: theme.palette.error.main,
            },
        },
        checked: {},

        '@global': {
            '.MuiRadio-root': {
                color: '#647083',
                padding: 5,
            },
            '.MuiFormControlLabel-label': {
                fontSize: 12,
                color: '#071e3f',
                marginTop: -1,
                whiteSpace: 'nowrap',
            },
            '.MuiFormControlLabel-root': {
                marginLeft: 0,
                marginRight: 0,
            },
        },
    }),
);

interface CRadioGroupProps {
    id: string;
    type?: 'cradio1' | 'cradio2' | 'cradio3' | 'cradio4' | undefined;
    title?: string;
    defaultValue?: string | undefined;
    items: Array<object>;
    row?: RadioGroupProps['row'];
    labelPlacement?: FormControlLabelProps['labelPlacement'];
    fullWidth?: FormControlProps['fullWidth'];
    disabled?: FormControlLabelProps['disabled'];
    onChange?(obj: any): void;
}

const CRadioGroup: React.FC<CRadioGroupProps> = (props) => {
    const classes = useStyles();
    const { formatMessage } = useIntl();
    const { t } = useTranslation();
    const {
        id,
        type,
        title,
        defaultValue = '',
        items,
        labelPlacement,
        fullWidth,
        disabled,
        row,
    } = props;
    const [value, setValue] = React.useState(defaultValue);
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);


    const className =
        (type === 'cradio1' && classes.cradio1) ||
        (type === 'cradio2' && classes.cradio2) ||
        (type === 'cradio3' && classes.cradio3) ||
        (type === 'cradio4' && classes.cradio4) ||
        classes.cradio1;

    return (
        <FormControl component="fieldset" fullWidth={fullWidth}>
            <RadioGroup
                row={row}
                aria-label={id}
                name={id}
                value={value}
            >
            </RadioGroup>
        </FormControl>
    );
};

export { CRadioGroup };
