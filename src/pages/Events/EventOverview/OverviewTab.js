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
}) => {
  return (
    <React.Fragment>
      <Row>
        <Col xl={9} lg={8}>
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
                          Eklenme Tarihi :
                        </p>
                        <h5 className="fs-15 mb-0">
                          {eventCreatedOn &&
                            new Date(eventCreatedOn).toLocaleString("tr-TR", {
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
                  </Row>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} lg={4}>
          <Card>
            <CardHeader className="align-items-center d-flex border-bottom-dashed text-center">
              <h4 className="card-title mb-0 flex-grow-1">Kişiler</h4>
            </CardHeader>

            <CardBody>
              <SimpleBar
                data-simplebar
                style={{ height: "100%", maxHeight: "420px" }}
                className="mx-n3 px-3"
              >
                <div className="vstack gap-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h5 className="fs-13 mb-0">
                        <Link to="#" className="text-dark d-block">
                          Nancy Martino
                        </Link>
                      </h5>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex align-items-center gap-1">
                        <button type="button" className="btn btn-light btn-sm">
                          Yükledikleri
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h5 className="fs-13 mb-0">
                        <Link to="#" className="text-dark d-block">
                          Henry Baird
                        </Link>
                      </h5>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex align-items-center gap-1">
                        <button type="button" className="btn btn-light btn-sm">
                          Yükledikleri
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h5 className="fs-13 mb-0">
                        <Link to="#" className="text-dark d-block">
                          Frank Hook
                        </Link>
                      </h5>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex align-items-center gap-1">
                        <button type="button" className="btn btn-light btn-sm">
                          Yükledikleri
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h5 className="fs-13 mb-0">
                        <Link to="#" className="text-dark d-block">
                          Jennifer Carter
                        </Link>
                      </h5>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex align-items-center gap-1">
                        <button type="button" className="btn btn-light btn-sm">
                          Yükledikleri
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h5 className="fs-13 mb-0">
                        <Link to="#" className="text-dark d-block">
                          Joseph Parker
                        </Link>
                      </h5>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex align-items-center gap-1">
                        <button type="button" className="btn btn-light btn-sm">
                          Yükledikleri
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h5 className="fs-13 mb-0">
                        <Link to="#" className="text-dark d-block">
                          Alexis Clarke
                        </Link>
                      </h5>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex align-items-center gap-1">
                        <button type="button" className="btn btn-light btn-sm">
                          Yükledikleri
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SimpleBar>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OverviewTab;
