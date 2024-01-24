import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import "react-datepicker/dist/react-datepicker.css";
import { CButton } from "@/components/buttons";

const CDatePicker = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    return (
        <>
            <DatePicker
                locale={ko}
                dateFormat="yyyy-MM-dd"
                className="input-datepicker"
                minDate={new Date()}
                closeOnScroll={true}
                placeholderText="날짜 선택"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
            />
            <span className="between"> ~ </span>
            <DatePicker
                locale={ko}
                dateFormat="yyyy-MM-dd"
                className="input-datepicker"
                minDate={new Date()}
                closeOnScroll={true}
                placeholderText="날짜 선택"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
            />
            <CButton type='btn4'>조회</CButton>
        </>
    );
};

export { CDatePicker };
