import {createGlobalState} from 'react-hooks-global-state';

const {useGlobalState, setGlobalState} = createGlobalState({
  username: '',
  userId: '',
  roomCode: '',
});

export {useGlobalState, setGlobalState};
