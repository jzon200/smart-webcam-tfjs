import CameraView from "./CameraView";

export default function Section() {
  return (
    <section id="demos" className="">
      <p>
        Hold some objects up close to your webcam to get a real-time
        classification! When ready click "enable webcam" below and accept access
        to the webcam when the browser asks (check the top left of your window)
      </p>
      <CameraView />
    </section>
  );
}
