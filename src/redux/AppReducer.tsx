import React from 'react';
import {getAuthUserDataThunk} from "./AuthReducer";
import {ThunkAction} from "redux-thunk";
import {InferActionsTypes} from "./Redux-Store";

type AuthState = {
    initialized : boolean,
}
const initialState: AuthState = {
    initialized : false,
}
export const AppReducer = (state = initialState, action: ActionsTypes) : AuthState => {
    switch (action.type) {
        case 'SET_INITIALIZED_SUCCESS' :
            return {
                ...state ,
                initialized : true
            }

        default:
            return state;
    }
};

//ACTION CREATORS - AC
type ActionsTypes = InferActionsTypes<typeof actions>
export const actions = {
    initializedSuccess : () => ({
            type : 'SET_INITIALIZED_SUCCESS',
    }as const)
}

// Thunks
type ThunkType = ThunkAction<Promise<void>, AuthState, unknown, ActionsTypes>

export const initializeApp = () : ThunkType => (dispatch : any) : any => {
   let promise =  dispatch(getAuthUserDataThunk())
    Promise.all([promise])
        .then(() => {
        dispatch(actions.initializedSuccess())
    })
}

export default AppReducer

