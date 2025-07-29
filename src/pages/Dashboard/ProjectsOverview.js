import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Label, Row } from "reactstrap";
import CountUp from "react-countup";
import { useSelector, useDispatch } from "react-redux";
import { ProjectsOverviewCharts } from "./DashboardProjectCharts";
import { getProjectChartsData } from "../../slices/thunks";
import { createSelector } from "reselect";
import { set } from "lodash";

const ProjectsOverview = ({ tabloData }) => {
  // Inside your component

  const [eventData, setEventData] = useState([]);

  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Yıl değiştikçe ilgili yılın ilk elemanını gönder
  useEffect(() => {
    if (Array.isArray(tabloData) && tabloData.length > 0) {
      const filtered = tabloData.filter((item) => item.year === year);
      if (filtered.length > 0) {
        setEventData([filtered[0]]);
      } else {
        setEventData([]);
      }
    } else {
      setEventData([]);
    }
  }, [tabloData, year]);

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <CardHeader className="border-0 align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Genel Bakış</h4>
              <div className="d-flex gap-1 align-items-center">
                <button
                  type="button"
                  className="btn btn-soft-primary btn-sm"
                  onClick={() => setYear((prev) => prev - 1)}
                  aria-label="Yılı azalt"
                >
                  <span>&lt;</span>
                </button>
                <span
                  style={{
                    minWidth: 50,
                    textAlign: "center",
                    fontWeight: 500,
                    fontSize: 16,
                  }}
                >
                  {year}
                </span>
                <button
                  type="button"
                  className="btn btn-soft-primary btn-sm"
                  onClick={() => setYear((prev) => prev + 1)}
                  aria-label="Yılı artır"
                >
                  <span>&gt;</span>
                </button>
              </div>
            </CardHeader>

            <CardHeader className="p-0 border-0 bg-light-subtle"></CardHeader>
            <CardBody className="p-0 pb-2">
              <div>
                <div dir="ltr" className="apex-charts">
                  <ProjectsOverviewCharts
                    series={Array.isArray(eventData) ? eventData : []}
                    dataColors='["--vz-primary", "--vz-primary-rgb, 0.1", "--vz-primary-rgb, 0.50"]'
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ProjectsOverview;
