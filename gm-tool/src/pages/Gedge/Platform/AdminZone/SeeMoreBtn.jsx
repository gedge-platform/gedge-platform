import React, { useState, useLayoutEffect } from "react";
import { observer } from "mobx-react";

const SeeMoreBtn = observer(({ name, keys, value }) => {
  const [isShowMore, setIsShowMore] = useState(false); // 더보기 열고 닫는 스위치
  useLayoutEffect(() => {
    setIsShowMore(false);
  }, [name]);
  const onClickShow = (e) => {
    setIsShowMore(!isShowMore); // 클릭 시 상태 반전
  };

  return (
    <>
      <tr>
        <th style={{ width: "15%" }}>{keys}</th>
        <td
          style={{ wordBreak: "break-all", wordWrap: "break-word" }} //강제로 줄바꿈
          key={value}
        >
          {value.length > 250
            ? isShowMore
              ? value
              : value.substr(0, 250)
            : value}
          {value.length > 250 &&
            (isShowMore ? (
              <button onClick={(e) => onClickShow(e)}> [닫기]</button>
            ) : (
              <button onClick={(e) => onClickShow(e)}> ...[더보기]</button>
            ))}
        </td>
      </tr>
    </>
  );
});
export default SeeMoreBtn;
