import {
  Card,
  CardContent,
  Divider,
  Grid2,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { BeatLoader } from "react-spinners";
import BounceLoader from "react-spinners/BounceLoader";
import PriceCardContent from "./PriceCardContent";
import "./App.css";
import { useSearchParams } from "react-router";

function App() {
  // ---------------------------- Websocket params & states -------------------------
  const searchParams = new URLSearchParams(window.location.search); // Search params on login url
  const loginUrl = searchParams.get("link-login");
  const socketRef = useRef(null); // Websocket reference
  const [responseData, setResponseData] = useState(null); // Last response data from the server

  // ---------------------------- Queue states -------------------------
  const [queuePlace, setQueuePlace] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);

  // ---------------------------- Websocket connection on website load -------------------------
  useEffect(() => {
    // open the connection when the component (or page) mounts
    const ws = new WebSocket(`ws://192.168.88.2:8080/request_login`);
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(searchParams.get("mac") + "," + searchParams.get("ip"));
    };

    ws.onmessage = (event) => {
      try {
        const messageJson = JSON.parse(event.data);
        setResponseData(messageJson);
      } catch (err) {
        console.log("Bad JSON from server", err, event.data);
      }
    };

    ws.onerror = console.error;
    ws.onclose = () => console.log(`socket closed`);
  }, []);

  useEffect(() => {
    if (responseData == null) {
      return;
    } else {
      const status = responseData.status;

      if (status == "waiting") {
        setQueuePlace(responseData.data.queue_pos - 1);
      } else if (status == "approved") {
        setLoginStatus(true);
        setTimeout(() => {
          window.location.href = "https://www.koinet.com";
        }, 3000);
      }
    }
  }, [responseData]);

  useEffect(() => {
    console.log("MAC ADDRESS: " + searchParams.get("mac"));
    console.log("IP: " + searchParams.get("ip"));
  }, []);

  return (
    <>
      <Stack
        spacing={4}
        boxSizing="border-box"
        alignItems="center"
        minHeight="100vh"
        padding={"8px"}
        margin={0}
      >
        <Card
          sx={{
            background: "RGB(30,30,40)",
            color: "white",
            boxSizing: "border-box",
            width: "100%",
            padding: "16px",
            borderRadius: "24px",
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h5" textAlign="center">
              Selamat datang di Wi-Fi Koin <br/> 
              {loginUrl}
            </Typography>
            <Typography
              paddingY={1}
              variant="body1"
              fontWeight={600}
              textAlign="center"
            >
              Layanan internet stabil dan cepat dengan harga terjangkau
            </Typography>
          </Stack>
        </Card>
        <Card
          sx={{
            width: "100%",
          }}
        >
          <PriceCardContent />
        </Card>
        <Stack>
          <Typography variant="body1"></Typography>
        </Stack>
        {queuePlace > 0 ? (
          <>
            <Typography variant="h6" textAlign="center">
              Mohon menunggu antrian untuk memasukkan koin.
            </Typography>
            <Stack
              sx={{ flex: "1" }}
              spacing={4}
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h6" textAlign="center" fontWeight={600}>
                Sisa Antrian: {queuePlace}
              </Typography>
              <BeatLoader speedMultiplier={0.25} />
            </Stack>
            <Card
              variant="outlined"
              sx={{
                boxSizing: "border-box",
                width: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h6" textAlign="center">
                  Akan terdapat batas waktu memasukkan koin, siapkan koin sambil
                  menunggu antrian.
                </Typography>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {loginStatus ? (
              <>
                <Typography variant="h6" textAlign="center">
                  Kamu mendapatkan akses internet selama 2 menit! <br />
                  Selamat menikmati akses internet murah dan cepat
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" textAlign="center">
                  Menunggu server... (DEBUG)
                </Typography>
              </>
            )}
          </>
        )}
      </Stack>
    </>
  );
}

export default App;
