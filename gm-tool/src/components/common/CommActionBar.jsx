import React, { useState } from "react";
import styled from "styled-components";
import theme from "@/styles/theme";
import { CIconButton } from "@/components/buttons";
import { swalError } from "@/utils/swal-utils";

const ActionArea = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-right: 2px !important;
  }
`;
const SearchArea = styled.div`
  display: flex;
  align-items: center;
`;
const SearchBar = styled.div`
  display: flex;
  position: relative;
  margin-right: 5px;
  padding-right: 10px;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    right: 305px;
    height: 30px;
    transform: translateY(-50%);
    /* border-left: 1px solid #e0e2e5; */
    border-right: 1px solid #fff;
  }
`;
const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 36px;
  border: 1px solid ${theme.colors.defaultDark};
  border-radius: 3px;
  margin-right: -10px;
  background-color: #222c45;
  button {
    margin-right: -1px;
    border: 0 !important;
    color: #fff;
    position: relative;
    .ico {
      position: absolute;
      top: 5px;
      /* background-position-y: -40px; */
    }
  }
  input {
    width: 200px;
    height: 100%;
    padding: 0 50px 0 10px;
    border: 0;
    background-color: #222c45;
  }
  select {
    width: 90px;
    height: 100%;
    padding: 0 0 0 15px;
    border: 0;
    color: #fff;
    background-color: #222c45;
    -moz-appearance: none; /* Firefox */
    -webkit-appearance: none; /* Safari and Chrome */
    appearance: none;
    outline: none;
    background: url("../../images/bullet/select_arr_g.png") no-repeat no-repeat 95% 50%;
  }
`;

const CommActionBar = props => {
  const { isSearch, isDate, isSelect, reloadFunc, keywordList = [], setSearch, setKeyword, search } = props;

  const [active, setActive] = useState(false);

  const searchActive = () => {
    setActive(true);
  };

  const onClick = () => {
    swalError("새로고침 되었습니다.", reloadFunc);
  };

  const handleSearch = ({ target: { value } }) => {
    setSearch(value);
  };
  const onChange = ({ target: { value } }) => {
    setKeyword(value);
  };

  return (
    <div className="panelTitBar">
      <ActionArea>{props.children}</ActionArea>
      <SearchArea>
        {isSearch && (
          <SearchBar>
            {isDate}
            <SearchBox>
              {isSelect && (
                <select className="search_Select" onChange={onChange}>
                  {keywordList.map(keyword => (
                    <option value={keyword}>{keyword}</option>
                  ))}
                </select>
              )}
              <input
                type="search"
                placeholder="검색어를 입력해 주세요."
                onChange={handleSearch}
                // onKeyPress={}
                value={search}
              />
              <CIconButton icon="search" type="btn1" tooltip="검색" onClick={onClick} />
            </SearchBox>
          </SearchBar>
        )}
        <CIconButton onClick={onClick} icon="refresh" type="btn1" tooltip="새로고침" />
      </SearchArea>
    </div>
  );
};

export default CommActionBar;
