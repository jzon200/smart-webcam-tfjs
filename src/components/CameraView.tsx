import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { DetectedObject, ObjectDetection } from "@tensorflow-models/coco-ssd";
import * as tfjs from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";

import styles from "./CameraView.module.scss";
import Highlighter from "./Highlighter";

export default function CameraView() {
  const [detectedObject, setDetectedObject] = useState<DetectedObject[]>([]);
  const modelRef = useRef<ObjectDetection>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const detectedObjects = detectedObject
    .filter((it) => it.score > 0.66)
    .map((it, index) => (
      <Highlighter
        key={index}
        objectName={it.class}
        score={it.score}
        bbox={it.bbox}
      />
    ));

  async function handleEnableCam() {
    // Only continue if the COCO-SSD has finished loading.
    if (modelRef.current == null) {
      return;
    }

    // Check if webcam access is supported.
    const getUserMediaSupported =
      !!navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

    if (!getUserMediaSupported) {
      console.warn("getUserMedia() is not supported by your browser");
      return;
    }

    // getUsermedia parameters to force video but not audio.
    const constraints = {
      video: true,
    };

    // Activate the webcam stream.
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoRef.current!.srcObject = stream;
  }

  async function handlePredictWebcam() {
    // Now let's start classifying a frame in the stream.
    const predictions = await modelRef.current!.detect(videoRef.current!);

    console.log(predictions);
    setDetectedObject(predictions);

    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(handlePredictWebcam);
  }

  useEffect(() => {
    async function loadModel() {
      const loadedModel = await cocoSsd.load();
      modelRef.current = loadedModel;
    }

    tfjs.ready().then(() => {
      loadModel();
    });
  }, []);

  return (
    <div id="liveView" className={styles.camView}>
      <button id="webcamButton" onClick={handleEnableCam}>
        Enable Webcam
      </button>
      <video
        ref={videoRef}
        onLoadedData={handlePredictWebcam}
        id="webcam"
        width="640"
        height="480"
        muted
        autoPlay
      />
      {detectedObjects}
    </div>
  );
}
