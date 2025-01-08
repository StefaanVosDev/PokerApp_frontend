import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import '@testing-library/jest-dom';
import ProfilePic from './ProfilePic.tsx';
import MockAvatarContext from '../../context/MockAvatarContext.ts';

describe('profilePic Component', () => {
    const mockAvatarProps = {
        avatar: 'https://example.com/avatar.jpg',
    };

    const playerContextValue = {
        currentPlayer: mockAvatarProps,
        setCurrentPlayer: () => {},
    };

    it('renders with required props', () => {
        render(
            <MockAvatarContext.Provider value={playerContextValue}>
                <ProfilePic isActive={false} left={10} image={mockAvatarProps.avatar} />
            </MockAvatarContext.Provider>
        );

        const profilePic = screen.getByAltText('Profile pic');
        expect(profilePic).toHaveAttribute('src', mockAvatarProps.avatar);
    });

    it('applies active class when isActive is true', () => {
        render(
            <MockAvatarContext.Provider value={playerContextValue}>
                <ProfilePic isActive={true} left={10} image={mockAvatarProps.avatar} />
            </MockAvatarContext.Provider>
        );

        const avatar = screen.getByAltText('Profile pic').closest('.player-avatar');
        expect(avatar).toHaveClass('active');
    });

    it('conditionally applies top style', () => {
        render(
            <MockAvatarContext.Provider value={playerContextValue}>
                <ProfilePic isActive={false} left={10} top={20} image={mockAvatarProps.avatar} />
            </MockAvatarContext.Provider>
        );

        const avatar = screen.getByAltText('Profile pic').closest('.player-avatar');
        expect(avatar).toHaveStyle('top: 20px');
    });
});
