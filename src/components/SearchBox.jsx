import React, { useState } from "react";

import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import { Search, HighlightOff } from "@material-ui/icons";

export const SearchBox = ({ defaultValue = "", placeholder, onSearch, className }) => {
  const [searchWord, setSearchWord] = useState(defaultValue);

  return (
    <TextField
      margin="dense"
      className={className}
      value={searchWord}
      placeholder={placeholder}
      style={{ width: "250px" }}
      onChange={(e) => setSearchWord(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === "Enter" && searchWord !== defaultValue) {
          onSearch({ search_word: searchWord });
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              onClick={() => {
                if (searchWord !== defaultValue) {
                  onSearch({ search_word: searchWord });
                }
              }}
            >
              <Search />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {searchWord && (
              <IconButton onClick={() => setSearchWord("")}>
                <HighlightOff fontSize="small" />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};
