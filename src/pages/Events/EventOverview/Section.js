import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";

//import images
import slack from "../../../assets/images/brands/slack.png";
import OverviewTab from "./OverviewTab";
import DocumentsTab from "./DocumentsTab";
import { getEventById } from "../../../api/events";
import { useEffect } from "react";
import TeamTab from "./TeamTab";

const Section = ({ eventId }) => {
  //Tab
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  const [eventData, setEventData] = useState(null);
  useEffect(() => {
    try {
      const fetchEvent = async () => {
        const eventData = await getEventById(eventId);
        setEventData(eventData);
        console.log("Event Data:", eventData);
      };
      fetchEvent();
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  }, []);
  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card className="mt-n4 mx-n4 border-0">
            <div className="bg-primary-subtle">
              <CardBody className="pb-0 px-4">
                <Row className="mb-3">
                  <div className="col-md">
                    <Row className="align-items-center g-3">
                      <div className="col-md-auto">
                        <div className="avatar-md">
                          {eventData && eventData.thumbnailUrl ? (
                            <img
                              src={eventData.thumbnailUrl}
                              alt="thumbnail"
                              className="avatar-xs rounded-circle"
                              style={{ width: "60px", height: "60px" }}
                            />
                          ) : (
                            <div className="avatar-title bg-gray rounded avatar-xs"></div>
                          )}
                        </div>
                      </div>
                      <div className="col-md">
                        <div>
                          <h4 className="fw-bold">
                            {eventData ? eventData.name : ""}
                          </h4>
                          <div className="hstack gap-3 flex-wrap">
                            <div>
                              Eklenme Tarihi :{" "}
                              <span className="fw-medium">
                                {eventData && eventData.createdOn
                                  ? new Date(
                                      eventData.createdOn
                                    ).toLocaleString("tr-TR", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : ""}
                              </span>
                            </div>
                            <div className="vr"></div>
                            <div>
                              Başlama Tarihi :{" "}
                              <span className="fw-medium">
                                {eventData && eventData.startTime
                                  ? new Date(
                                      eventData.startTime
                                    ).toLocaleString("tr-TR", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : ""}
                              </span>
                            </div>
                            <div className="vr"></div>
                            <div>
                              Bitiş Tarihi :{" "}
                              <span className="fw-medium">
                                {eventData && eventData.endTime
                                  ? new Date(eventData.endTime).toLocaleString(
                                      "tr-TR",
                                      {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Row>
                  </div>
                  <div className="col-md-auto">
                    <div className="hstack gap-1 flex-wrap">
                      <button
                        type="button"
                        className="btn py-0 fs-16 favourite-btn active"
                      >
                        <i className="ri-star-fill"></i>
                      </button>
                      <button
                        type="button"
                        className="btn py-0 fs-16 text-dark"
                      >
                        <i className="ri-share-line"></i>
                      </button>
                      <button
                        type="button"
                        className="btn py-0 fs-16 text-dark"
                      >
                        <i className="ri-flag-line"></i>
                      </button>
                    </div>
                  </div>
                </Row>

                <Nav className="nav-tabs-custom border-bottom-0" role="tablist">
                  <NavItem>
                    <NavLink
                      className={classnames(
                        { active: activeTab === "1" },
                        "fw-semibold"
                      )}
                      onClick={() => {
                        toggleTab("1");
                      }}
                      href="#"
                    >
                      Genel Bakış
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames(
                        { active: activeTab === "2" },
                        "fw-semibold"
                      )}
                      onClick={() => {
                        toggleTab("2");
                      }}
                      href="#"
                    >
                      Belgeler
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames(
                        { active: activeTab === "3" },
                        "fw-semibold"
                      )}
                      onClick={() => {
                        toggleTab("3");
                      }}
                      href="#"
                    >
                      Kişiler
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardBody>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <TabContent activeTab={activeTab} className="text-muted">
            <TabPane tabId="1">
              <OverviewTab
                eventDescription={eventData ? eventData.description : ""}
                eventCreatedOn={eventData ? eventData.createdOn : ""}
                eventStartTime={eventData ? eventData.startTime : ""}
                eventEndTime={eventData ? eventData.endTime : ""}
              />
            </TabPane>
            <TabPane tabId="2">
              <DocumentsTab />
            </TabPane>
            <TabPane tabId="3">
              <TeamTab />
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Section;
