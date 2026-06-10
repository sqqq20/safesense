import { useEffect, useRef } from "react";

// =====================================
// GLOBAL SINGLETONS
// =====================================
let pc = null;

let remoteStream = null;

export default function WebRTCPlayer() {

  const videoRef = useRef(null);

  useEffect(() => {

    async function start() {

      // =====================================
      // CREATE ONLY ONCE
      // =====================================
      if (!pc) {

        console.log("CREATING NEW PC");

        pc = new RTCPeerConnection();

        pc.ontrack = (event) => {

          console.log("TRACK RECEIVED");

          remoteStream = event.streams[0];

          if (videoRef.current) {

            videoRef.current.srcObject =
              remoteStream;
          }
        };

        pc.oniceconnectionstatechange = () => {

          console.log(
            "ICE:",
            pc.iceConnectionState
          );
        };

        pc.addTransceiver(
          "video",
          {
            direction: "recvonly"
          }
        );

        const offer =
          await pc.createOffer();

        await pc.setLocalDescription(
          offer
        );

        const response = await fetch(
          "http://192.168.0.8:8081/offer",
          {
            method: "POST",

            body: JSON.stringify({
              sdp:
              pc.localDescription.sdp,

              type:
              pc.localDescription.type
            }),

            headers: {
              "Content-Type":
              "application/json"
            }
          }
        );

        const answer =
          await response.json();

        await pc.setRemoteDescription(
          answer
        );

      }

      // =====================================
      // REATTACH STREAM
      // =====================================
      if (
        remoteStream &&
        videoRef.current
      ) {

        videoRef.current.srcObject =
          remoteStream;
      }
    }

    start();

    // =====================================
    // NO CLEANUP
    // =====================================
    return () => {};

  }, []);

  return (

    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }}
    />

  );
}