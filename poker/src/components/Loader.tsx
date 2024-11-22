import { CircularProgress, Stack, Typography } from '@mui/material'

interface LoaderProps {
    children: string
}

export default function Loader({ children }: LoaderProps) {
    return (
        <Stack alignItems="center" spacing={4} marginTop={4}>
            <Typography variant="h4">{children}</Typography>
            <CircularProgress/>
        </Stack>
    )
}
