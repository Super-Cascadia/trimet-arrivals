import React from "react";
import { Route } from "../../api/trimet/types";
import Modal from "../../component/modal/Modal";
import ModalContent from "../../component/modal/ModalContent";
import { LoadStopData } from "../../store/action/stopActions";
import { StopLocationsDictionary } from "../../store/reducers/stopsReducer";
import Stops from "./components/Stops";
import "./Stops.css";

interface Props {
  loadStopData: LoadStopData;
  loading: boolean;
  stopLocations: StopLocationsDictionary;
  timeOfLastLoad: string;
}

interface State {
  modalOpen: boolean;
  routeInfo: Route;
}

export default class StopsComponent extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      routeInfo: null
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  public componentDidMount() {
    const { loadStopData } = this.props;

    if (loadStopData) {
      loadStopData(500);
    }
  }

  public render() {
    const { loading, stopLocations, timeOfLastLoad } = this.props;

    return (
      <div>
        {loading && <div className="loading-message">Loading...</div>}
        {!loading && stopLocations && (
          <div className="nearby-stops">
            <main>
              <h1>
                Nearby Stops | <i>{timeOfLastLoad}</i>
              </h1>
              <div className="flex-container">
                <section className="flex-stops">
                  <Stops
                    stopLocations={stopLocations}
                    showArrivals={true}
                    onRouteIndicatorClick={this.openModal}
                  />
                </section>
                {this.state.modalOpen && (
                  <div className="flex-info">
                    <aside id="modal-root" className="modal-wrapper" />
                    <Modal>
                      <ModalContent
                        route={this.state.routeInfo}
                        closeModal={this.closeModal}
                      />
                    </Modal>
                  </div>
                )}
              </div>
            </main>
          </div>
        )}
      </div>
    );
  }

  public closeModal() {
    this.setState({
      modalOpen: false,
      routeInfo: null
    });
  }

  public openModal(route: Route) {
    this.setState({
      modalOpen: true,
      routeInfo: route
    });
  }
}
