import { Card, CardContent, Divider, Grid2, LinearProgress, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import BounceLoader from "react-spinners/BounceLoader"
import PriceCardContent from './PriceCardContent'
import './App.css'

function App() {
  const [queueCount, setQueueCount] = useState(4);
  const [countdownTimer, setCountdownTimer] = useState(0);
  const [topupTimer, setTopupTimer] = useState(0);
  const [isAcceptingCoin, setIsAcceptingCoin] = useState(false);
  const [isTopupTimeout, setIsTopupTimeout] = useState(false);
  const [coinCount, setCoinCount] = useState(0);

  function parseCoinToMoney(coinCount) {
    if (coinCount == 0) return "Rp 0"


    let text = "Rp "
    if (coinCount > 10) text = text + coinCount + "."
    else text = text + coinCount

    text = text + "000"
    return text;
  }

  function parseCoinToTime(coinCount) {
    return coinCount * 30 + " Menit"
  }


  // DEMO
  useEffect(() => {
    window.addMoney = () => {
      if (!isAcceptingCoin) {
        console.error("Invalid command: not accepting money")
      } else {
        setCoinCount((prev) => {
          return prev + 1
        });
        console.log("Debug command: added coin")
      }
    }
  }, [isAcceptingCoin])

  useEffect(() => {
    let rundownTimer;

    // DEMO
    if (queueCount > 0) {
      const minDelay = 3000
      const maxDelay = 5000

      setTimeout(() => {
        setQueueCount((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            return 0;
          }
        })
      }, Math.floor(Math.random() * (minDelay - maxDelay + 1) + minDelay))
    }

    if (queueCount == 0 && !isAcceptingCoin) {
      setCountdownTimer(5);

      rundownTimer = setInterval(() => {
        setCountdownTimer((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            setIsAcceptingCoin(true);
            clearInterval(rundownTimer);
            return 0;
          }
        })
      }, 1000);
    }

    return () => clearInterval(rundownTimer);
  }, [queueCount])


  // This should be on the server instead of client.
  useEffect(() => {
    let topUpInterval;

    if (isAcceptingCoin && topupTimer == 0) {
      setTopupTimer(10)

      topUpInterval = setInterval(() => {
        setTopupTimer((prev) => {
          if (prev > 0) return prev - 1
          else {
            setIsTopupTimeout(true)
            clearInterval(topUpInterval);
          }
        })
      }, 1000)
    }
  }, [isAcceptingCoin])

  useEffect(() => {
    if (isAcceptingCoin) {
      setTopupTimer(10);
    }
  }, [coinCount])

  return (
    <>
      <Stack spacing={4}
        boxSizing="border-box"
        alignItems="center"
        minHeight="100vh"
        padding={"8px"}
        margin={0}
      >
        <Card sx={{
          background: "RGB(30,30,40)",
          color: "white",
          boxSizing: "border-box",
          width: "100%",
          padding: "16px",
          borderRadius: "24px"
        }}>
          <Stack spacing={2}>
            <Typography variant='h5' textAlign="center">
              Selamat datang di Wi-Fi Koin
            </Typography>
            <Typography paddingY={1} variant='body1' fontWeight={600} textAlign="center">
              Layanan internet stabil dan cepat dengan harga terjangkau
            </Typography>
          </Stack>
        </Card>
        <Card sx={{
          width: "100%",
        }}>
          <PriceCardContent />
        </Card>
        {
          queueCount > 0 ? <>
            <Typography variant='h6' textAlign="center">
              Mohon menunggu antrian untuk memasukkan koin.
            </Typography>
            <Stack
              sx={{ flex: "1" }}
              spacing={4}
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant='h6' textAlign="center" fontWeight={600}>
                Sisa Antrian: {queueCount + 1}
              </Typography>
              <BeatLoader speedMultiplier={0.25} />
            </Stack>
            <Card variant='outlined' sx={{
              boxSizing: "border-box",
              width: "100%",
            }}>
              <CardContent>
                <Typography variant='h6' textAlign="center">
                  Akan terdapat batas waktu memasukkan koin, siapkan koin sambil
                  menunggu antrian.
                </Typography>
              </CardContent>
            </Card></> :
            <>
              {
                isTopupTimeout ? <>
                </> : <>
                  <Typography variant='h6' textAlign="center">
                    Masukkan koin dalam batas waktu yang diberikan.
                    Memasukkan koin akan mengulang batas waktu.
                  </Typography>
                  <div style={{ flex: "1", justifyContent: "center", alignItems: "center", display: "flex" }}>
                    <Card variant='outlined' sx={{
                      backgroundColor: (isAcceptingCoin) ? "darkgreen" : "red",
                      color: "white",
                      borderRadius: "24px"
                    }}>
                      <CardContent>
                        <Typography variant='h6' textAlign='center' fontWeight={600}>
                          {isAcceptingCoin ? "Silahkan masukkan koin" : "Mohon menunggu: " + countdownTimer}
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                  <Stack height={60} width="100%" spacing={2} justifyContent="end">
                    {isAcceptingCoin ? <>
                      <Typography variant='h6' fontWeight={600} textAlign="center">
                        Batas waktu: {topupTimer}
                      </Typography>
                      <LinearProgress variant='determinate' value={topupTimer * 10} sx={{ width: "100%" }} /></> : <>
                    </>}
                  </Stack>
                  <Grid2 container spacing={1} justifyContent="center">
                    <Grid2 size={6}>
                      <Card variant='outlined'>
                        <CardContent>
                          <Stack spacing={2} justifyContent="center" alignItems="center">
                            <Typography fontWeight={600} textAlign="center">
                              Jumlah koin yang dimasukkan
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <span className='material-symbols-outlined'>paid</span>
                              <Typography>{parseCoinToMoney(coinCount)}</Typography>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid2>
                    <Grid2 size={6}>
                      <Card variant='outlined'>
                        <CardContent>
                          <Stack spacing={2} justifyContent="center" alignItems="center">
                            <Typography fontWeight={600} textAlign="center">
                              Waktu internet yang didapatkan
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <span className='material-symbols-outlined'>timer</span>
                              <Typography>{parseCoinToTime(coinCount)}</Typography>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid2>
                  </Grid2>
                </>
              }
            </>
        }
      </Stack>
    </>
  )
}

export default App
