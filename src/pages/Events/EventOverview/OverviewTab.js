import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import avatar8 from "../../../assets/images/users/avatar-8.jpg";
import avatar10 from "../../../assets/images/users/avatar-10.jpg";
import avatar6 from "../../../assets/images/users/avatar-6.jpg";
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import avatar7 from "../../../assets/images/users/avatar-7.jpg";
import image4 from "../../../assets/images/small/img-4.jpg";
import image5 from "../../../assets/images/small/img-5.jpg";

const OverviewTab = ({
  eventDescription,
  eventCreatedOn,
  eventStartTime,
  eventEndTime,
  eventDomainName,
  eventTheme,
  eventUserList,
}) => {
  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="text-muted">
                <h6 className="mb-3 fw-semibold text-uppercase">Açıklama</h6>
                <div dangerouslySetInnerHTML={{ __html: eventDescription }} />

                <div className="pt-3 border-top border-top-dashed mt-4">
                  <Row>
                    <Col lg={3} sm={6}>
                      <div>
                        <p className="mb-2 text-uppercase fw-medium">
                          Başlama Tarihi :
                        </p>
                        <h5 className="fs-15 mb-0">
                          {eventStartTime &&
                            new Date(eventStartTime).toLocaleString("tr-TR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </h5>
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <div>
                        <p className="mb-2 text-uppercase fw-medium">
                          Bitiş Tarihi :
                        </p>
                        <h5 className="fs-15 mb-0">
                          {eventEndTime &&
                            new Date(eventEndTime).toLocaleString("tr-TR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </h5>
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <div>
                        <p className="mb-2 text-uppercase fw-medium">Tema :</p>
                        <h5 className="fs-15 mb-0">{eventTheme}</h5>
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <div>
                        <p className="mb-2 text-uppercase fw-medium">
                          Domain Adı :
                        </p>
                        <h5 className="fs-15 mb-0">{eventDomainName}</h5>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OverviewTab;
