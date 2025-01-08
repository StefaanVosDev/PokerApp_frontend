import {createContext} from 'react';

export interface MockAvatarProps {
    avatar: string;
}

export interface PlayerContextProps {
    currentPlayer: MockAvatarProps;
    setCurrentPlayer: (player: MockAvatarProps) => void;
}

const PlayerContext = createContext<PlayerContextProps>({
    currentPlayer: { avatar: '' },
    setCurrentPlayer: () => {},
});

export default PlayerContext;
