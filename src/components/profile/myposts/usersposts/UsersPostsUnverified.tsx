import React, {useEffect, useState} from 'react';
import {actionsMyPosts, fetchPostsThunk, MyPostsInitialState, onPageChangeThunk, ResponseTestAPIDataType, setUnverifiedUserIDThunk, setUserIdThunk} from "../../../redux/MyPostsReducer";
import robot1 from "../../../assets/images/robot-a4.png";
import robot2 from "../../../assets/images/robot-a5.png";
import robot3 from "../../../assets/images/robot-b1.png";
import robot4 from "../../../assets/images/robot-b2.png";
import robot5 from "../../../assets/images/robot-b3.png";
import robot6 from "../../../assets/images/robot-b4.png";
import robot7 from "../../../assets/images/robot-b5.png";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/Redux-Store";
import {ThunkDispatch} from "redux-thunk";
import styles from "../MyPosts.module.css";
import CurrentPostComponent from "../CurrentPostComponent";
import EditPostComponent from "../EditPostComponent";
import PaginationUsers from "../../../users/PaginationUsers";
import usePostFetchUsers from "./usePostFetchUsers";


// THAT IS POST COMPONENT FOR UNVERIFIED USER (NOT THE ADMIN)
const UsersPostsUnverified: React.FC<{ idUserURL: number }> = ({idUserURL}) => {
    const {posts, currentPage, pageSize}: MyPostsInitialState = useSelector((state: RootState) => state.myposts)
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()

    // Run Fetch function to send posts data when the component mounts
    usePostFetchUsers({idUserURL})
    if (!posts) return <div>loading...</div> //Preloader

    const indexOfLastPost: number = currentPage * pageSize
    const indexOfFirstPost: number = indexOfLastPost - pageSize
    const currentPosts: Array<ResponseTestAPIDataType> = posts.slice(indexOfFirstPost, indexOfLastPost) //Show 5 posts per page
    const handlePageChangeMyPosts = (pageNumber: number) => {
        dispatch(onPageChangeThunk(pageNumber)); //dispatch current page
    };
    return (
        <div>

            <div className={styles.container}>
                <h2 className={styles.heading}>POSTS</h2>

                <CurrentPostComponent
                    idUserURL={idUserURL}
                    currentPosts={currentPosts}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    posts={posts}
                />

                <div className={styles.paginationContainer}>
                    <PaginationUsers
                        totalUsersCount={posts.length}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={handlePageChangeMyPosts}
                    />
                </div>
            </div>
        </div>
    );
};

export default UsersPostsUnverified;