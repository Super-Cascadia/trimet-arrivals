import React from "react";
import { Route } from "../../api/trimet/types";

interface Props {
  route: Route;
}

export default function ModalContent({ route }: Props) {
  return (
    <div className="modal-content">
      <h1>{route.desc}</h1>
      <p>Type: {route.type}</p>
      <h2>Directions:</h2>
      <p>{route.dir[0].desc}</p>
    </div>
  );
}
