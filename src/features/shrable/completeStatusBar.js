import { ProgressBar } from "react-bootstrap";
function CompleteStatusBar(props) {
  return (
    <ProgressBar
      variant="success"
      now={props.countRatio}
      label={props.countRatio + "%"}
      style={{ width: "200px" }}
    />
  );
}

export default CompleteStatusBar;
