

import { reducerCases } from "./constants";

export const  initialState = {
  audioCall:undefined,
  videoCall:undefined,
  incomingAudioCall:undefined,
  incomingVideoCall:undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_AUDIO_CALL: {
      return{
        ...state,
        audioCall: action.audioCall
      }
    }
    case reducerCases.SET_VIDEO_CALL: {
      return{
        ...state,
        videoCall: action.videoCall
      }
    }
    case reducerCases.SET_INCOMING_AUDIO_CALL: {
      return{
        ...state,
        incomingAudioCall: action.incomingAudioCall
      }
    }
    case reducerCases.SET_INCOMING_VIDEO_CALL: {
      return{
        ...state,
        incomingVideoCall: action.incomingVideoCall
      }
    }
    case reducerCases.END_CALL: {
      return{
        ...state,
        videoCall: undefined,
        audioCall: undefined,
        incomingVideoCall: undefined,
        incomingAudioCall: undefined,
      }
    }

    default:
      return state;
  }
}

export default reducer;