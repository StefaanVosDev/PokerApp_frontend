import CircularProgress from '@mui/material/CircularProgress';
import {Stack, Typography} from '@mui/material';
import {ReactNode} from "react";
import {motion} from "framer-motion";
import "./Loader.scss"

interface LoaderProps {
    children: ReactNode
}

function Loader({ children } : LoaderProps) {
    const chipImageSrc = 'https://storage.googleapis.com/poker_stacks/others/stacks_chip.png';

    return (
        <Stack alignItems="center" spacing={4} marginTop={20}>
            <CircularProgress
                variant="determinate"
                value={100}
                sx={{
                    color: 'transparent',
                    position: 'relative',
                }}
            />
            <motion.img
                className="spinning-chip"
                src={chipImageSrc}
                alt="Spinning Chip"
                animate={{rotate: 360}}
                transition={{duration: 1, repeat: Infinity}}
            />
            <Typography variant="h4">{children}</Typography>
        </Stack>
    );
}

export default Loader