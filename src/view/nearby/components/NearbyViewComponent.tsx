import React from "react";
import { Spinner } from "react-bootstrap";
import { TrimetRoute } from "../../../api/trimet/interfaces/types";
import Modal from "../../../component/modal/Modal";
import ModalContent from "../../../component/modal/ModalContent";
import NearbySubRoutes from "../../../routes/NearbySubRoutes";
import { LoadStopData } from "../../../store/action/stopActions";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import Loading from "../../loading/Loading";
import NearbyMapContainer from "../containers/NearbyMapContainer";
import NearbySubNavContainer from "../containers/NearbySubNavContainer";
import "./NearbyViewComponent.scss";

interface Props {
  loadStopData: LoadStopData;
  loading: boolean;
  stopLocations: StopLocationsDictionary;
}

interface State {
  modalOpen: boolean;
  routeInfo: TrimetRoute;
}

export default class NearbyViewComponent extends React.Component<Props, State> {
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
      loadStopData(1000);
    }
  }

  public render() {
    const { loading, stopLocations } = this.props;

    return (
      <div id="nearby-stops-view-component">
        {loading && <Loading />}
        {!loading && stopLocations && (
          <div className="nearby-stops">
            <main>
              <div className="flex-container">
                <section className="flex-stops">
                  <NearbyMapContainer />
                  <NearbySubNavContainer />
                  <NearbySubRoutes />
                </section>
                {this.state.modalOpen && this.showModal()}
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

  public openModal(route: TrimetRoute) {
    this.setState({
      modalOpen: true,
      routeInfo: route
    });
  }

  private showModal() {
    return (
      <div className="flex-info">
        <aside id="modal-root" className="modal-wrapper" />
        <Modal>
          <ModalContent
            route={this.state.routeInfo}
            closeModal={this.closeModal}
          />
        </Modal>
      </div>
    );
  }
}
