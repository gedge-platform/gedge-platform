import React, { useState, useEffect } from "react";

const KeywordList = {
  NAME: "이름",
};

const SearchV1 = (keyword, text, target) => {
  resultList = [];

  switch (keyword) {
    case KeywordList.NAME:
      Object.entries(target).map(([key, value]) => {
        console.log(key, value);
      });
      break;
    default:
      return null;
      break;
  }
};

export { SearchV1 };
