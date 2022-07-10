import { Fragment } from "react";
import styles from "./Highlighter.module.scss";

type Props = {
  objectName: string;
  score: number;
  bbox: number[];
};

export default function Highlighter({ objectName, score, bbox }: Props) {
  const confidenceLevel = Math.round(score * 100);

  return (
    <Fragment>
      <div
        className={styles.highlighter}
        style={{ left: bbox[0], top: bbox[1], width: bbox[2], height: bbox[3] }}
      />
      <p
        style={{
          marginLeft: bbox[0],
          marginTop: bbox[1] - 10,
          width: bbox[2] - 10,
        }}
      >{`${objectName} - with ${confidenceLevel}% confidence.`}</p>
    </Fragment>
  );
}
