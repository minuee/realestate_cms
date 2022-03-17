import { useHistory } from "react-router-dom";
import qs from "query-string";

import {
  Pagination as SimplePagination,
  SearchBox as SimpleSearchBox,
  SearchBox2 as SimpleSearchBox2,
  SortBox as SimpleSortBox,
  FilterBox as SimpleFilterBox,
  TermBox as SimpleTermBox,
  AreaBox as SimpleAreaBox,
} from "components";

export const useSearchParams = (location) => {
  const history = useHistory();
  const search_params = qs.parse(location.search);

  function updateSearchParams(update) {
    if (!update.hasOwnProperty("page")) {
      update.page = 1;
    }

    Object.assign(search_params, update);
    history.push(`${location.pathname}?` + qs.stringify(search_params));
  }

  const Pagination = (props) => <SimplePagination page={search_params.page} setPage={updateSearchParams} {...props} />;
  const SearchBox = (props) => (
    <SimpleSearchBox defaultValue={search_params.search_word} onSearch={updateSearchParams} {...props} />
  );
  const SearchBox2 = (props) => (
    <SimpleSearchBox2 defaultValue={search_params.search_word2} onSearch={updateSearchParams} {...props} />
  );

  const SortBox = (props) => <SimpleSortBox search_params={search_params} onSort={updateSearchParams} {...props} />;
  const FilterBox = (props) => (
    <SimpleFilterBox search_params={search_params} onFilter={updateSearchParams} {...props} />
  );
  const AreaBox = (props) => (
    <SimpleAreaBox search_params={search_params} onAreaChange={updateSearchParams} {...props} />
  );
  const TermBox = (props) => (
    <SimpleTermBox
      term_start={search_params.term_start}
      term_end={search_params.term_end}
      onTermSearch={updateSearchParams}
      {...props}
    />
  );

  return { search_params, updateSearchParams, Pagination, SearchBox,SearchBox2, SortBox, FilterBox, AreaBox, TermBox };
};
