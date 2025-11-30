import { map, sortBy } from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { Card, ListGroup, Tab, Table, Tabs } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { useParams } from "react-router-dom";
import { Arrival, ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import { getFormattedTime } from "../util/timeUtils";
import ArrivalListItem from "./common/ArrivalListItem";
import { ExpandCollapseListItem } from "./common/ExpandCollapseListItem";

interface StopArrivalsParams {
  data: ArrivalData;
}

function sortArrivalsByEstimated(arrivals: Arrival[]): Arrival[] {
  return sortBy(arrivals, arrival =>
    moment(arrival.scheduled)
      .utc()
      .valueOf()
  );
}

interface ArrivalsTableParams {
  data?: ArrivalData;
  arrivals?: Arrival[];
  selectedIndex?: number;
  onSelectDeparture?: (index: number) => void;
}

function getArrivalsList(
  allArrivals: Arrival[], 
  displayArrivals: Arrival[], 
  selectedIndex?: number, 
  onSelectDeparture?: (index: number) => void
) {
  const { id } = useParams();

  return map(displayArrivals, (arrival: Arrival) => {
    // Find the original index in the full list
    const originalIndex = allArrivals.indexOf(arrival);
    
    return (
      <ArrivalListItem 
        key={arrival.id} 
        id={id} 
        arrival={arrival} 
        isSelected={selectedIndex === originalIndex}
        onSelect={onSelectDeparture ? () => onSelectDeparture(originalIndex) : undefined}
      />
    );
  });
}

export function ArrivalList({ data, arrivals, selectedIndex = 0, onSelectDeparture }: ArrivalsTableParams) {
  const sortedArrivals = arrivals || (data ? sortArrivalsByEstimated(data.arrival) : []);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isSelectionMode = !!onSelectDeparture;
  
  let displayArrivals = sortedArrivals;
  let hasEarlier = false;
  let hasLater = false;
  
  if (isSelectionMode) {
    if (!isExpanded) {
      if (sortedArrivals[selectedIndex]) {
        displayArrivals = [sortedArrivals[selectedIndex]];
      } else {
        displayArrivals = [];
      }
      hasEarlier = selectedIndex > 0;
      hasLater = selectedIndex < sortedArrivals.length - 1;
    } else {
      displayArrivals = sortedArrivals;
    }
  }
  
  const arrivalsList = getArrivalsList(sortedArrivals, displayArrivals, selectedIndex, onSelectDeparture);

  return (
    <Card>
      <Card.Header>Departures</Card.Header>
      <ListGroup variant="flush" as="ul">
        {hasEarlier && (
          <ExpandCollapseListItem onClick={() => setIsExpanded(true)} icon="chevron-up">
            {selectedIndex} earlier departure{selectedIndex === 1 ? '' : 's'}
          </ExpandCollapseListItem>
        )}
        
        {arrivalsList}
        
        {hasLater && (
          <ExpandCollapseListItem onClick={() => setIsExpanded(true)} icon="chevron-down">
            {sortedArrivals.length - 1 - selectedIndex} future departure{sortedArrivals.length - 1 - selectedIndex === 1 ? '' : 's'}
          </ExpandCollapseListItem>
        )}
        
        {isExpanded && isSelectionMode && (
          <ExpandCollapseListItem onClick={() => setIsExpanded(false)} icon="chevron-up">
            Show Less
          </ExpandCollapseListItem>
        )}
      </ListGroup>
    </Card>
  );
}

function getArrivalRows(data: ArrivalData) {
  const sortedArrivals = sortArrivalsByEstimated(data.arrival);
  return map(sortedArrivals, (arrival: Arrival) => {
    const estimatedTime = arrival.estimated
      ? getFormattedTime(arrival.estimated)
      : "No estimation";
    const scheduledTime = getFormattedTime(arrival.scheduled);

    return (
      <tr>
        <td>
          <small>{arrival.shortSign}</small>
        </td>
        <td>
          <small>{estimatedTime}</small>
        </td>
        <td>
          <small>{scheduledTime}</small>
        </td>
      </tr>
    );
  });
}

function ArrivalsTable({ data }: ArrivalsTableParams) {
  return (
    <Table striped={true} bordered={true} hover={true} size="sm">
      <thead>
        <th>Route</th>
        <th>Est. Arrival</th>
        <th>Scheduled</th>
      </thead>
      <tbody>{getArrivalRows(data)}</tbody>
    </Table>
  );
}

function StopArrivals({ data }: StopArrivalsParams) {
  return (
    <>
      <ArrivalList data={data} />
      {/*<h5>Arrivals</h5>*/}
      {/*<Tabs defaultActiveKey="list" id="stop-arrival-tabs" className="mb-3">*/}
      {/*  <Tab eventKey="list" title="List">*/}
      {/*    <ArrivalList data={data} />*/}
      {/*  </Tab>*/}
      {/*  <Tab eventKey="table" title="Table">*/}
      {/*    <ArrivalsTable data={data} />*/}
      {/*  </Tab>*/}
      {/*</Tabs>*/}
    </>
  );
}

export default StopArrivals;
