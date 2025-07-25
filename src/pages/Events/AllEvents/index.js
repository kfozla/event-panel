import React from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Container } from "reactstrap";
import List from "./List";
import EventTable from "./EventTable";

function index() {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Tüm Etkinlikler" pageTitle="Etkinlikler" />

          <div className="events-list">
            <List />
          </div>
          {/*
          <div className="events-tasks">
            <EventTable />
          </div>*/}
        </Container>
      </div>
    </React.Fragment>
  );
}

export default index;
