import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
    
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action)=>{
            state.status = true;
            state.userData = action.payload
        },

        logout: (state)=>{
            state.status = false;
            state.userData = null;
        },

        // addPost : (state, action) => {
        //     state.posts.push(action.payload.post)
        // },

        // updatePost :(state, action)=>{
        //     const index = state.posts.findIndex(post => post.$id === action.payload.post.$id);
        //     if (index !== -1) {
        //         state.posts[index] = action.payload.post;
        //     }
        // }

        // post here also

    }
})


export const {login, logout, addPost, updatePost} = authSlice.actions;

export default authSlice.reducer;

