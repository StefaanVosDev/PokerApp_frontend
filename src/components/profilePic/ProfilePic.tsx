import {Avatar} from "@mui/material";

interface ProfilePicProps {
    isActive: boolean;
    left: number;
    top?: number;
    image: string | undefined;
}

export default function ProfilePic({ isActive, top, left, image }: ProfilePicProps) {
    return (
        <Avatar
            className={`player-avatar ${isActive ? "active" : ""}`}
            alt="Profile pic"
            src={image}
            sx={{
                width: 48,
                height: 48,
                border: '2px solid #ffd700',
                left: left,
                ...(top !== undefined && { top: top }), // Conditionally add `top`
            }}
        />
    );
}
