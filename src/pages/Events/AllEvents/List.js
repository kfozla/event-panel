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
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer } from "react-toastify";

//redux
import { useSelector, useDispatch } from "react-redux";

//Import Icons
import FeatherIcon from "feather-icons-react";

//import action
import { getEventList, deleteEventList } from "../../../slices/thunks";
import { createSelector } from "reselect";
import { use } from "react";

const List = () => {
  const dispatch = useDispatch();

  const selectDashboardData = createSelector(
    (state) => state.Events,
    (Events) => Events.eventLists
  );
  // Inside your component
  const eventLists = useSelector(selectDashboardData);

  const [event, setEvent] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(getEventList());
  }, [dispatch]);

  useEffect(() => {
    setEvent(eventLists);
  }, [eventLists]);

  // delete
  const onClickData = (event) => {
    setEvent(event);
    setDeleteModal(true);
  };
  const handleDeleteEventList = () => {
    if (event) {
      dispatch(deleteEventList(event.id));
      setDeleteModal(false);
    }
  };

  const activebtn = (ele) => {
    if (ele.closest("button").classList.contains("active")) {
      ele.closest("button").classList.remove("active");
    } else {
      ele.closest("button").classList.add("active");
    }
  };
  console.log("eventLists", eventLists);
  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteEventList()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Row className="g-4 mb-3">
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

      <div className="row">
        {(eventLists || []).map((item, index) => (
          <React.Fragment key={index}>
            <Col xxl={3} sm={6} className="project-card">
              <Card className="card-height-100">
                <CardBody>
                  <div className="d-flex flex-column h-100">
                    <div className="d-flex ">
                      <div className="flex-grow-1">
                        <p className="text-muted mb-4">
                          {"Son Güncelleme : "}
                          {item.modifiedOn &&
                            new Date(item.modifiedOn).toLocaleString("tr-TR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="d-flex gap-1 align-items-center">
                          <button
                            type="button"
                            className={`btn avatar-xs mt-n1 p-0 favourite-btn ${item.ratingClass}`}
                            onClick={(e) => activebtn(e.target)}
                          >
                            <span className="avatar-title bg-transparent fs-15">
                              <i className="ri-star-fill"></i>
                            </span>
                          </button>
                          <UncontrolledDropdown direction="start">
                            <DropdownToggle
                              tag="button"
                              className="btn btn-link text-muted p-1 mt-n2 py-0 text-decoration-none fs-15"
                            >
                              <FeatherIcon
                                icon="more-horizontal"
                                className="icon-sm"
                              />
                            </DropdownToggle>

                            <DropdownMenu className="dropdown-menu-end">
                              <DropdownItem href="apps-projects-overview">
                                <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
                                Görüntüle
                              </DropdownItem>
                              <DropdownItem href="apps-projects-create">
                                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                                Düzenle
                              </DropdownItem>
                              <div className="dropdown-divider"></div>
                              <DropdownItem
                                href="#"
                                onClick={() => onClickData(item)}
                                data-bs-toggle="modal"
                                data-bs-target="#removeProjectModal"
                              >
                                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                                Sil
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex mb-2">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-sm">
                          <img
                            src={item.thumbnailUrl}
                            alt=""
                            className="img-fluid rounded "
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fs-15">
                          <Link
                            to="/apps-events-overview"
                            className="text-dark"
                          >
                            {item.name}
                          </Link>
                        </h5>
                        <div
                          className="text-muted text-truncate-two-lines"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardBody>
                <div className="card-footer bg-transparent border-top-dashed py-2">
                  <div className="d-flex align-items-center ">
                    <div className="flex-shrink-0">
                      <div className="text-muted">
                        <span className="fw-bold">Başlama : </span>
                        {item.startTime &&
                          new Date(item.startTime).toLocaleString("tr-TR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-top-dashed py-2">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="text-muted">
                        <span className="fw-bold">Bitiş : </span>
                        {item.endTime &&
                          new Date(item.endTime).toLocaleString("tr-TR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </React.Fragment>
        ))}
      </div>
      <Row className="g-0 text-center text-sm-start align-items-center mb-4">
        <Col sm={6}>
          <div>
            <p className="mb-sm-0 text-muted">
              <span className="fw-semibold text-decoration-underline">12</span>{" "}
              etkinlikten <span className="fw-semibold">1</span> ile{" "}
              <span className="fw-semibold">10</span> arasındakiler
              gösteriliyor.
            </p>
          </div>
        </Col>

        <Col sm={6}>
          <ul className="pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
            <li className="page-item disabled">
              <Link to="#" className="page-link">
                Önceki
              </Link>
            </li>
            <li className="page-item active">
              <Link to="#" className="page-link">
                1
              </Link>
            </li>
            <li className="page-item ">
              <Link to="#" className="page-link">
                2
              </Link>
            </li>
            <li className="page-item">
              <Link to="#" className="page-link">
                3
              </Link>
            </li>
            <li className="page-item">
              <Link to="#" className="page-link">
                4
              </Link>
            </li>
            <li className="page-item">
              <Link to="#" className="page-link">
                5
              </Link>
            </li>
            <li className="page-item">
              <Link to="#" className="page-link">
                Sonraki
              </Link>
            </li>
          </ul>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default List;
