import React from "react";
import { useParams } from "react-router-dom";
import LineDetailViewContainer from "../container/LineDetailViewContainer";

function LineDetailComponent() {
  const { id } = useParams();

  return <LineDetailViewContainer id={id} />;
}

export default LineDetailComponent;
