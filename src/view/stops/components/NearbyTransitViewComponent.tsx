import React, { lazy, Suspense } from "react";
import { Route } from "../../../api/trimet/types";
import ComponentLoadIndicator from "../../../component/loadIndicator/ComponentLoadIndicator";
import MapLoadIndicator from "../../../component/loadIndicator/MapLoadIndicator";
import Modal from "../../../component/modal/Modal";
import ModalContent from "../../../component/modal/ModalContent";
import { LoadStopData } from "../../../store/action/stopActions";
import { StopLocationsDictionary } from "../../../store/reducers/stopsReducer";
import { RouteDirectionDict } from "../../../store/reducers/util/getRoutesFromStopLocations";
import "../Stops.scss";

const NearbyStopsMap = lazy(() =>
  import(
    /* webpackChunkName: "NearbyStopsMap" */ "../../../component/maps/NearbyStopsMap"
  )
);
const MainNavigation = lazy(() =>
  import(
    /* webpackChunkName: "MainNavigation" */ "../../../component/nav/MainNavigation"
  )
);
const NearbyLists = lazy(() =>
  import(/* webpackChunkName: "NearbyLists" */ "./NearbyLists")
);

interface Props {
  loadStopData: LoadStopData;
  loading: boolean;
  stopLocations: StopLocationsDictionary;
  nearbyRoutes: RouteDirectionDict;
  currentLocation: number[];
  numberOfBookmarks: number;
  timeOfLastLoad: string;
  onInitialLoad: () => void;
  match: any;
}

interface State {
  modalOpen: boolean;
  routeInfo: Route;
}

export default class NearbyTransitViewComponent extends React.Component<
  Props,
  State
> {
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
    this.props.onInitialLoad();

    const { loadStopData } = this.props;

    if (loadStopData) {
      loadStopData(1000);
    }
  }

  public render() {
    const { numberOfBookmarks, timeOfLastLoad } = this.props;

    return (
      <div>
        <MainNavigation
          numberOfBookmarks={numberOfBookmarks}
          timeOfLastLoad={timeOfLastLoad}
        />
        {this.getNearbyStops()}
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

  private getNearbyStops() {
    const { loading = true, stopLocations } = this.props;

    return (
      <main className="main-view">
        <div id="nearby-stops-view-component">
          {!loading && stopLocations && this.nearbyStops()}
        </div>
      </main>
    );
  }

  private nearbyStops() {
    const { stopLocations, currentLocation, nearbyRoutes } = this.props;

    /*tslint:disable:jsx-no-lambda*/
    return (
      <div className="nearby-stops">
        <main>
          <div className="flex-container">
            <section className="flex-stops">
              <Suspense fallback={MapLoadIndicator()}>
                <NearbyStopsMap
                  currentLocation={currentLocation}
                  stopLocations={stopLocations}
                  nearbyRoutes={nearbyRoutes}
                />
              </Suspense>
              <Suspense fallback={ComponentLoadIndicator()}>
                <NearbyLists
                  stopLocations={stopLocations}
                  openModal={this.openModal}
                  nearbyRoutes={nearbyRoutes}
                />
              </Suspense>
            </section>
            {this.state.modalOpen && this.showModal()}
          </div>
        </main>
      </div>
    );
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
