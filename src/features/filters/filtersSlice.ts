import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  search: string;
  tag: string | null;
}

const initialState: FiltersState = {
  search: '',
  tag: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setTag(state, action: PayloadAction<string | null>) {
      state.tag = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setSearch, setTag, resetFilters } = filtersSlice.actions;
export const filtersReducer = filtersSlice.reducer;
