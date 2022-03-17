import React, { useState } from "react";

import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import { Search, HighlightOff } from "@material-ui/icons";

export const SearchBox2 = ({ defaultValue = "", placeholder, onSearch, className }) => {
  const [searchWord2, setSearchWord2] = useState(defaultValue);
  console.log('searchWord2',searchWord2)
  return (
    <TextField
      margin="dense"
      className={className}
      value={searchWord2}
      placeholder={placeholder}
      style={{ width: "270px" }}
      onChange={(e) => setSearchWord2(e.target.value.trim())}
      onKeyPress={(e) => {
        if (e.key === "Enter" && searchWord2 !== defaultValue) {
          onSearch({ search_word2: searchWord2 });
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              onClick={() => {
                if (searchWord2 !== defaultValue) {
                  onSearch({ search_word2: searchWord2 });
                }
              }}
            >
              <Search />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {searchWord2 && (
              <IconButton onClick={() => setSearchWord2("")}>
                <HighlightOff fontSize="small" />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};
