import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../api";

const initialState = {
    details: [],
    isLoading: true,
};

const schoolSlice =  createSlice({
    name:'languagesDetails',
    initialState,
    reducers:{
        getItem:(state, action)=>{
            state.details = action.payload
            state.isLoading = false
        },
        setLoading: (state) => {
            state.isLoading = true;
          },
    }
});

export const { getItem } = schoolSlice.actions;
const { setLoading } = schoolSlice.actions;


export const fetchData = () => async (dispatch) => {
    dispatch(setLoading());

    try {
        const response = await axios.get(`${api}getLanguage`);
        const data = response.data.data;
        dispatch(getItem(data));
    } catch (error) {
        console.log(error);
    }
};

export default schoolSlice.reducer;