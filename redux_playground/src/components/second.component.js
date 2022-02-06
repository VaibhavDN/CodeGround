import { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { setAppData } from "../store";

let Second = (props) => {
  useEffect(() => {
    console.log(props);
  }, []);
  return <div>Second component {props.val2}</div>;
};

const mapDispatchToProps = { setAppData };
const mapStateToProps = (state) => {
  const { preparedFinalObject = {} } = state.reducer;
  console.log("second", state);
  const { val2 = "NA" } = preparedFinalObject;
  return { val2 };
};
export default connect(mapStateToProps, mapDispatchToProps)(Second);
