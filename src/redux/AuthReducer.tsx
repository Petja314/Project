import React from 'react';
import {ResultCodeForCaptcha, ResultCodesEnum} from "../api/Api";
import {ThunkAction} from "redux-thunk";
import {InferActionsTypes} from "./Redux-Store";
import {authAPI} from "../api/AuthAPI";

export type AuthState = {
    userIdTemp : number | null;
    userId: number | null;
    email: string | null;
    login: string | null;
    isAuth: boolean;
    captchaUrl: string | null;
    loginError : null
}
let initialState: AuthState = {
    userIdTemp : null,
    userId: null,
    email: null,
    login: null,
    isAuth: false,
    captchaUrl: null,
    loginError : null
}

export const AuthReducer = (state = initialState, action: ActionsTypes): AuthState => {
    switch (action.type) {
        case 'SET_USER_DATA' :
            return {
                ...state,
                ...action.payload,
                userId: action.payload.userId
            };
        case 'CAPTCHA_IS_SUCCESS' :
            return {
                ...state,
                ...action.payload,
            }
        case 'SET_LOGIN_ERROR' :
            return  {
                ...state,
                loginError : action.error
            }
        case "SET_USER_ID" :
            return {
                ...state,
                userIdTemp : action.userId
            }
        default:
            return state;
    }
};

type ActionsTypes = InferActionsTypes<typeof actions>
export const actions = {
     setAuthUsersDataAC : (userId: number | null, login: string, email: string, isAuth: boolean) => ({
            type: 'SET_USER_DATA',
            payload: {userId, login, email, isAuth},
    }as const),
     resetAuthUserData : () => ({
            type: 'SET_USER_DATA',
            payload: {userId: null, login: null, email: null, isAuth: false}
    }as const),
     captchaSuccessAC : (captchaUrl: any) => ({
            type: 'CAPTCHA_IS_SUCCESS',
            payload: {captchaUrl}
    }as const),
    setLoginErrorAC : (error : any) => ({
        type : "SET_LOGIN_ERROR",
        error : error
    }as const),
    setCurrentUserIdAC  : (userId : any) => ({
        type : "SET_USER_ID",
        userId
    }as const)
}

type ThunkType = ThunkAction<Promise<void>, AuthState, unknown, ActionsTypes >
    // | ReturnType <typeof stopSubmit>>
export const getAuthUserDataThunk = () : ThunkType  => {
    return async (dispatch) => {
        let response = await authAPI.me()
        if (response.data.resultCode === ResultCodesEnum.Success) {
            let {id, login, email} = response.data.data
            dispatch(actions.setAuthUsersDataAC(id, login, email, true))
        }
    }
}
export const loginThunk = (email: string, password: string, rememberMe: boolean, captcha: null) : ThunkType   => {
   return async (dispatch  ) => {
        let response = await authAPI.login(email, password, rememberMe, captcha)
        if (response.data.resultCode === ResultCodesEnum.Success) {
           await dispatch(getAuthUserDataThunk())
        } else if (response.data.resultCode === ResultCodeForCaptcha.CaptchaIsRequired) {
           await dispatch(captchaThunk())
        }
        else {
            // debugger
            const loginError = response.data.messages[0]
            dispatch(actions.setLoginErrorAC(loginError))
            // console.log(loginError)
        }
    }
}

export const logoutThunk = () :ThunkType => async (dispatch) => {
    // debugger
    let response = await authAPI.logout()
    if (response.data.resultCode === ResultCodesEnum.Success) {
        dispatch(actions.resetAuthUserData())
    }
}
export const captchaThunk = () :ThunkType => async (dispatch) => {
    const response = await authAPI.captcha();
    const captchaUrl = response.data.url
    dispatch(actions.captchaSuccessAC(captchaUrl))
}

export default AuthReducer

