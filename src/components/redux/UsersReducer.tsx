import React from 'react';
import {ResultCodesEnum} from "../../api/Api";
import {Dispatch} from "redux";
import {ThunkAction} from "redux-thunk";
import {InferActionsTypes} from "./Redux-Store";
import {usersAPI} from "../../api/UsersAPI";
import {act} from "react-dom/test-utils";
import friends from "../friends/Friends";
import {actionsFriends} from "./FriendsReducer";

// const FOLLOW = "samurai-network/UsersReducer/FOLLOW"
// const UNFOLLOW = "samurai-network/UsersReducer/UNFOLLOW"
// const SET_USERS = "samurai-network/UsersReducer/SET_USERS"
// const CURRENT_PAGE = "samurai-network/UsersReducer/CURRENT_PAGE"
// const TOTAL_USERS_COUNTS = "samurai-network/UsersReducer/TOTAL_USERS_COUNTS"
// const TOGGLE_IS_FETCHING = "samurai-network/UsersReducer/TOGGLE_IS_FETCHING"
// const TOGGLE_IS_FOLLOWING_PROGRESS = "samurai-network/UsersReducer/TOGGLE_IS_FOLLOWING_PROGRESS"
// const INCREMENT_PAGE_BTN = "samurai-network/UsersReducer/INCREMENT_PAGE_BTN"

export type  UsersComponentTypeArrays = {
    users: UsersArrayType[],
    pageSize: number,
    totalUsersCount: number,
    currentPage: number,
    isFetching: boolean,
    followingInProgress: [],
    filter: {
        term: string,
        friend: null | boolean
    },

}
export type UsersArrayType = {
    "name": string,
    "id": number,
    "uniqueUrlName": boolean,
    "photos": {
        "small": string,
        "large": string
    },
    "status": string,
    "followed": boolean
}


const initialState: UsersComponentTypeArrays = {
    users: [],
    pageSize: 10,
    totalUsersCount: 0,
    currentPage: 1,
    isFetching: true,
    followingInProgress: [],
    filter: {
        term: "",
        friend: null as null | boolean
    },
}
export type FilterType = typeof initialState.filter

// export type FormType = {
//     term: string
//     friend: "true" | "false" | "null" | string
// }

export const UsersReducer = (state = initialState, action: ActionsTypes): UsersComponentTypeArrays => {
    switch (action.type) {
        case 'FOLLOW':
            return {
                ...state,
                users: state.users.map(item => {
                    if (item.id === action.userID) {
                        return {...item, followed: true}
                    }
                    return item
                })
            }
        case 'UNFOLLOW' :
            return {
                ...state,
                users: state.users.map(item => {
                    if (item.id === action.userID) {
                        return {...item, followed: false}
                    }
                    return item
                })
            }
        case 'SET_USERS' :
            return {...state, users: action.users}
        case 'CURRENT_PAGE' :
            return {...state, currentPage: action.currentPage}
        case 'TOTAL_USERS_COUNTS' :
            return {...state, totalUsersCount: action.totalCount}
        case 'TOGGLE_IS_FETCHING' :
            return {...state, isFetching: action.isFetching}
        case 'TOGGLE_IS_FOLLOWING_PROGRESS' :
            return {
                ...state,
                followingInProgress: action.isFetching
                    ? [...state.followingInProgress, action.userID]
                    : state.followingInProgress.filter(id => id != action.userID)
            } as UsersComponentTypeArrays
        case 'INCREMENT_PAGE_BTN' :
            return {
                ...state,
                currentPage: action.currentPage
            }
        case 'SET_FILTER' :
            return {
                ...state,
                filter: action.payload,
            }

        default:
            return state;
    }
};

//ACTION CREATORS - AC

type ActionsTypes = InferActionsTypes<typeof actions>

export const actions = {
    follow: (userID: number) => ({
        type: 'FOLLOW',
        userID: userID
    } as const),
    unfollow: (userID: number) => ({
        type: 'UNFOLLOW',
        userID: userID
    } as const),
    setUsers: (users: UsersArrayType[]) => ({
        type: 'SET_USERS',
        users: users
    } as const),
    setCurrentPage: (currentPage: number) => ({
        type: 'CURRENT_PAGE',
        currentPage: currentPage
    } as const),
    setTotalUsersCount: (totalCount: number) => ({
        type: 'TOTAL_USERS_COUNTS',
        totalCount: totalCount
    } as const),
    setToggleFetching: (isFetching: boolean) => ({
        type: 'TOGGLE_IS_FETCHING',
        isFetching: isFetching
    } as const),
    setFollowingProgress: (isFetching: boolean, userID: number) => ({
        type: 'TOGGLE_IS_FOLLOWING_PROGRESS',
        isFetching,
        userID
    } as const),
    incrementCurrentPageButton: (currentPage: number) => ({
        type: 'INCREMENT_PAGE_BTN',
        currentPage: currentPage
    } as const),
    setFilter: (filter: FilterType) => ({
        type: 'SET_FILTER',
        payload: filter
    } as const),
}


export const getUsersThunkCreator = (currentPage: number, pageSize: number, filter: FilterType): any => {
    return async (dispatch: any) => {
        dispatch(actions.setToggleFetching(true))
        // debugger
        dispatch(actions.setFilter(filter))
        let response = await usersAPI.getUsers(currentPage, pageSize, filter.term, filter.friend)
        dispatch(actions.setToggleFetching(false))
        dispatch(actions.setUsers(response.data.items))
        dispatch(actions.setTotalUsersCount(response.data.totalCount))
        dispatch(actions.setCurrentPage(currentPage))
    }
}

// to type dispatch only = Dispatch<UsersComponentTypeArrays>
type ThunkType = ThunkAction<Promise<void>, UsersComponentTypeArrays, unknown, ActionsTypes>
export const unfollowUserThunkCreator = (id: number): any => {
    return async (dispatch : any) => {
        dispatch(actions.setFollowingProgress(true, id))
        let response = await usersAPI.unFollowUser(id)
        if (response.data.resultCode === ResultCodesEnum.Success) {
            dispatch(actions.unfollow(id))
            dispatch(actionsFriends.unfollowFriendAC(id))
            // dispatch(actions.removeFriendAC(id))
        }
        dispatch(actions.setFollowingProgress(false, id))
    }
}

export const followUserThunkCreator = (id: number): ThunkType => {
    return async (dispatch) => {
        dispatch(actions.setFollowingProgress(true, id))
        let response = await usersAPI.followUser(id)
        if (response.data.resultCode === ResultCodesEnum.Success) {
            dispatch(actions.follow(id))
            // dispatch(actions.addFriendAC(id))
        }
        dispatch(actions.setFollowingProgress(false, id))
    }
}



// FOLLOW UNFOLLOW CODE REFACTORING
// const followUnfollowFlow = async  (dispatch : Dispatch<UsersComponentTypeArrays>,id : any,apiMethod : any,actionCreator : any) =>  {
//     dispatch(setFollowingProgress(true,id))
//     let response = await apiMethod(id)
//     if (response.data.resultCode === 0) {
//         dispatch(actionCreator(id))
//     }
//     dispatch(setFollowingProgress(false,id))
// }
//
// export const unfollowUserThunkCreator = (id : any) => {
//         return async (dispatch: any) => {
//             await followUnfollowFlow(dispatch, id, usersAPI.unFollowUser.bind(usersAPI), unfollow)
//     }}
//
// export const followUserThunkCreator = (id : any) => {
//     return async (dispatch: any) => {
//         await followUnfollowFlow(dispatch, id, usersAPI.followUser.bind(usersAPI), follow)
//     }}

    export default UsersReducer

