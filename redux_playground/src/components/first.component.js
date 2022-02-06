import { useEffect } from "react";
import { connect } from "react-redux";
import { setAppData } from "../store";

let First = (props) => {
  useEffect(() => {
    console.log("first", props);
    props.setAppData({ path: "val2", value: "Hello from first" });
  }, []);
  return <div>First component</div>;
};

const mapDispatchToProps = { setAppData };
const mapStateToProps = (state) => {
  const { preparedFinalObject = {} } = state.reducer;
  const { val1 = {} } = preparedFinalObject;
  return { val1 };
};
export default connect(mapStateToProps, mapDispatchToProps)(First);
