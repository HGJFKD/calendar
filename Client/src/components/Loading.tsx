import { Box, CircularProgress } from '@mui/material'
const Loading = () => {
    return (
        <Box
            display="flex"
            justifyItems="center"
            >
            <CircularProgress />
        </Box>
    )
}

export default Loading