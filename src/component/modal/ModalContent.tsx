import React from "react";
import { Route } from "../../api/trimet/types";

interface Props {
  route: Route;
  closeModal: () => void;
}

export default function ModalContent({ route, closeModal }: Props) {
  return (
    <div className="modal-content">
      <header>
        <h3>Route Info</h3>
        <h4>{route.desc}</h4>
        <button onClick={closeModal} name="Close" title="Close">
          Close
        </button>
      </header>
      <section>
        <p>Type: {route.type}</p>
        <h4>Directions:</h4>
        <p>{route.dir[0].desc}</p>
      </section>
    </div>
  );
}
