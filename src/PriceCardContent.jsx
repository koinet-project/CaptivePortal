import { CardContent, Typography, Grid2, Stack, Divider } from "@mui/material"

export default function PriceCardContent() {
    return (
        <CardContent>
            <Typography variant='h6' textAlign='center' fontWeight={600}>Harga Penyewaan</Typography>
            <Grid2 container padding={1}>
                <Grid2 size="grow" padding={[0, 1, 0, 1]}>
                    <Stack direction="row" spacing={2} alignItems='center' justifyContent='center'>
                        <span className='material-symbols-outlined'>
                            paid
                        </span>
                        <Typography variant='body1' textAlign="center">Rp. 1000</Typography>
                    </Stack>
                </Grid2>
                <Grid2>
                    <Divider orientation='vertical' />
                </Grid2>
                <Grid2 size="grow" padding={[0, 1, 0, 1]}>
                    <Stack direction="row" spacing={2} alignItems='center' justifyContent='center'>
                        <span className='material-symbols-outlined'>
                            timer
                        </span>
                        <Typography variant='body1' textAlign="center">30 Menit</Typography>
                    </Stack>
                </Grid2>
            </Grid2>
        </CardContent>
    )
}