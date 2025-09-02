import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likesNotification:[],
    },
    reducers: {
        setLikeNotification: (state,action) => {
            if(action.payload.type === 'like'){
                state.likesNotification.push(action.payload)
            }else if(action.payload.type === 'dislike'){
                state.likesNotification = state.likesNotification.filter((item) => item.userId !== action.payload.userId)
            }
        }
    }
})

export const {setLikeNotification} = rtnSlice.actions
export default rtnSlice.reducer