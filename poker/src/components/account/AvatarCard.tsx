import {Avatar as MUIAvatar, Box, Button, Typography} from "@mui/material";
import {Avatar} from "../../model/Avatar.ts";

interface AvatarCardProps {
    avatarItem: Avatar;
    isMyAccount: boolean;
    avatar: Avatar;
    handleSelect: (selectedAvatarId: string) => void;
}

function AvatarCard({avatarItem, isMyAccount, avatar, handleSelect}: AvatarCardProps) {
    return <Box textAlign="center">
        <MUIAvatar
            src={avatarItem.image}
            alt={avatarItem.name}
            sx={{
                width: 80,
                height: 80,
                border: `2px solid #3b82f6`,
            }}
        />
        <Typography
            variant="body2"
            sx={{
                fontFamily: "'Kalam', sans-serif",
                marginTop: "5px",
            }}
        >
            {avatarItem.name}
        </Typography>
        {/*check if the page is  being visited by the logged in user or a friend*/}
        {isMyAccount &&
            (avatarItem.id === avatar.id ? (
                    <Button
                        disabled={true}
                        sx={{
                            backgroundColor: 'grey',
                            color: 'white',
                            border: 'none',
                            padding: '10px 15px',
                            cursor: 'not-allowed',
                            marginTop: '10px'
                        }}
                    >
                        Selected
                    </Button>
                ) : (
                    <Button
                        onClick={() => handleSelect(avatarItem.id)}
                        sx={{
                            backgroundColor: 'blue',
                            color: 'white',
                            border: 'none',
                            padding: '10px 15px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        Select
                    </Button>
                )
            )}
    </Box>
}

export default AvatarCard;