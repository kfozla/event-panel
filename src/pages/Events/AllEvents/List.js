import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
  UncontrolledDropdown,
} from "reactstrap";

import EventTable from "./EventTable";

const List = () => {
  return (
    <React.Fragment>
      <Row className="g-4 mb-3 pb-3">
        <div className="col-sm-auto">
          <div>
            <Link to="/apps-events-add" className="btn btn-soft-secondary">
              <i className="ri-add-line align-bottom me-1"></i> Yeni Ekle
            </Link>
          </div>
        </div>
        <div className="col-sm-3 ms-auto">
          <div className="d-flex justify-content-sm-end gap-2">
            <div className="search-box ms-2 col-sm-7">
              <Input
                type="text"
                className="form-control"
                placeholder="Ara..."
              />
              <i className="ri-search-line search-icon"></i>
            </div>

            <select
              className="form-control w-md"
              data-choices
              data-choices-search-false
            >
              <option value="All">Tümü</option>
              <option value="Last 7 Days">Son 7 Gün</option>
              <option value="Last 30 Days">Son 30 Gün</option>
              <option value="Last Year">Son Yıl</option>
              <option value="This Month">Bu Ay</option>
              <option value="Today">Bugün</option>
              <option value="Yesterday" defaultValue>
                Dün
              </option>
            </select>
          </div>
        </div>
      </Row>
      <EventTable />
    </React.Fragment>
  );
};

export default List;
