import { size } from "lodash";
import React from "react";
import { Route as RouterRoute, Switch } from "react-router-dom";
import { Route } from "../../../api/trimet/types";
import NearbyStopsMap from "../../../component/maps/NearbyStopsMap";
import Modal from "../../../component/modal/Modal";
import ModalContent from "../../../component/modal/ModalContent";
import MainNavigation from "../../../component/nav/MainNavigation";
import { LoadStopData } from "../../../store/action/stopActions";
import { StopLocationsDictionary } from "../../../store/reducers/stopsReducer";
import { RouteDirectionDict } from "../../../store/reducers/util/getRoutesFromStopLocations";
import "../Stops.scss";
import NearbyRoutes from "./NearbyRoutes";
import Stops from "./Stops";

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

export default class NearbyStopsViewComponent extends React.Component<
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
        <main className="main-view">{this.getNearbyStops()}</main>
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
      <div id="nearby-stops-view-component">
        {loading && <div className="loading-message">Loading...</div>}
        {!loading && stopLocations && this.nearbyStops()}
      </div>
    );
  }

  private nearbyStops() {
    const { stopLocations, currentLocation, nearbyRoutes } = this.props;

    const stopCount = size(stopLocations);
    const routeCount = size(nearbyRoutes);
    /*tslint:disable:jsx-no-lambda*/
    return (
      <div className="nearby-stops">
        <main>
          <div className="flex-container">
            <section className="flex-stops">
              <NearbyStopsMap
                currentLocation={currentLocation}
                stopLocations={stopLocations}
                nearbyRoutes={nearbyRoutes}
              />
              <Switch>
                <RouterRoute
                  path={`/nearby/routes`}
                  component={() => (
                    <NearbyRoutes
                      nearbyRoutes={nearbyRoutes}
                      stopCount={stopCount}
                      routeCount={routeCount}
                    />
                  )}
                />
                <RouterRoute
                  path={`/nearby/stops`}
                  component={() => (
                    <Stops
                      stopLocations={stopLocations}
                      showArrivals={false}
                      onRouteIndicatorClick={this.openModal}
                      stopCount={stopCount}
                      routeCount={routeCount}
                    />
                  )}
                />
                <RouterRoute
                  exact={true}
                  path={`/nearby`}
                  component={() => (
                    <NearbyRoutes
                      nearbyRoutes={nearbyRoutes}
                      stopCount={stopCount}
                      routeCount={routeCount}
                    />
                  )}
                />
              </Switch>
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
