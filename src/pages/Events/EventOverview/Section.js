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
import { Link } from "react-router-dom";

//import images
import slack from "../../../assets/images/brands/slack.png";
import OverviewTab from "./OverviewTab";
import DocumentsTab from "./DocumentsTab";
import {
  getEventById,
  deleteEvent,
  getEventMediaList,
  getEventUserList,
} from "../../../api/events";
import { useEffect } from "react";
import TeamTab from "./TeamTab";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import { set } from "lodash";
import { useNavigate } from "react-router-dom";

const Section = ({ eventId }) => {
  const navigate = useNavigate();
  //Tab
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  const [eventData, setEventData] = useState(null);
  // Delete Task
  const [deleteModal, setDeleteModal] = useState(false);
  const [event, setEvent] = useState(null);
  const onClickData = (eventData) => {
    setEvent(eventData);
    setDeleteModal(true);
  };
  // Silme işlemi

  const handleDeleteEventList = () => {
    if (event) {
      deleteEvent(event.id)
        .then(() => {
          toast.success("Event deleted successfully");
          setTimeout(() => {
            navigate("/apps-events-all");
          }, 2400);
        })
        .catch((error) => {
          toast.error("Error deleting event");
        });
      setDeleteModal(false);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        eventData.mediaList = await getEventMediaList(eventId);
        eventData.userList = await getEventUserList(eventId);
        setEventData(eventData);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    fetchEvent();
  }, []);

  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteEventList()}
        onCloseClick={() => setDeleteModal(false)}
      />
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

                            <div
                              className="d-flex justify-content-end gap-2 "
                              style={{ marginLeft: "auto" }}
                            >
                              <Link
                                to={`/apps-events-update/${eventId}`}
                                className="btn btn-light view-btn"
                              >
                                Düzenle
                              </Link>
                              <Link
                                className="btn btn-danger view-btn"
                                onClick={() => onClickData(eventData)}
                              >
                                Sil
                              </Link>
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
                      Yüklemeler
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
                eventDomainName={eventData ? eventData.domainName : ""}
                eventTheme={eventData ? eventData.theme : ""}
                eventUserList={eventData ? eventData.userList : []}
              />
            </TabPane>
            <TabPane tabId="2">
              <DocumentsTab mediaList={eventData ? eventData.mediaList : []} />
            </TabPane>
            <TabPane tabId="3">
              <TeamTab
                userList={eventData ? eventData.userList : []}
                eventID={eventData ? eventData.id : null}
              />
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Section;
