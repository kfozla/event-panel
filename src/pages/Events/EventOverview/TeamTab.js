import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Modal,
  Row,
  UncontrolledDropdown,
  ModalBody,
  ModalHeader,
} from "reactstrap";

//SimpleBar
import SimpleBar from "simplebar-react";

//import images
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import avatar8 from "../../../assets/images/users/avatar-8.jpg";

import avatar7 from "../../../assets/images/users/avatar-7.jpg";
import avatar5 from "../../../assets/images/users/avatar-5.jpg";

import { useEffect } from "react";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer } from "react-toastify";
import { getUserMediaCount, deleteUser } from "../../../api/user";
import { getEventUserList } from "../../../api/events";

const TeamTab = ({ eventID }) => {
  const [userList, setUserList] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [deleteModal, setDeleteModal] = React.useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getEventUserList(eventID);
        const usersWithMedia = await Promise.all(
          (res || []).map(async (u) => {
            if (u.mediaCount === undefined) {
              try {
                const mediaRes = await getUserMediaCount(u.id);
                return { ...u, mediaCount: mediaRes.data };
              } catch {
                return { ...u, mediaCount: null };
              }
            }
            return u;
          })
        );
        setUserList(usersWithMedia);
      } catch {
        setUserList([]);
      }
    };
    fetchUsers();
  }, [eventID]);

  // Kullanıcı silme işlemi
  const onClickData = (user) => {
    setUser(user);
    setDeleteModal(true);
  };

  const handleDeleteEventList = async () => {
    if (user) {
      await deleteUser(user.id);
      setDeleteModal(false);
      // Kullanıcı listesini güncelle
      const res = await getEventUserList(eventID);
      const usersWithMedia = await Promise.all(
        (res || []).map(async (u) => {
          if (u.mediaCount === undefined) {
            try {
              const mediaRes = await getUserMediaCount(u.id);
              return { ...u, mediaCount: mediaRes.data };
            } catch {
              return { ...u, mediaCount: null };
            }
          }
          return u;
        })
      );
      setUserList(usersWithMedia);
    }
  };
  console.log("User List:", userList);
  return (
    <React.Fragment>
      <ToastContainer />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteEventList()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Row className="g-4 mb-3">
        <div className="col-sm">
          <div className="d-flex">
            <div className="search-box me-2">
              <input
                type="text"
                className="form-control"
                placeholder="Kişi ara..."
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
        </div>
      </Row>

      <div className="team-list list-view-filter">
        {userList.map((user, index) => (
          <Card className="team-box" key={index}>
            <CardBody className="px-4">
              <Row className="align-items-center team-row">
                <div className="col team-settings"></div>
                <Col lg={4}>
                  <div className="team-profile-img">
                    <div className="team-content">
                      <Link to="#" className="d-block">
                        <h5 className="fs-16 mb-1">{user.username}</h5>
                      </Link>
                    </div>
                  </div>
                </Col>
                <Col lg={4}>
                  <Row className="text-muted text-center">
                    <Col xs={6}>
                      <h5 className="mb-1">
                        {user.mediaCount !== undefined
                          ? user.mediaCount.data ?? user.mediaCount
                          : "Yükleniyor..."}
                      </h5>
                      <p className="text-muted mb-0">Yükleme</p>
                    </Col>
                  </Row>
                </Col>
                <Col lg={2} className="col">
                  <div className="text-end">
                    <Link
                      to={`/apps-events-user-medialist/${user.id}`}
                      className="btn btn-light view-btn"
                    >
                      Yükledikleri
                    </Link>
                  </div>
                </Col>
                <Col lg={2} className="col">
                  <div className="text-end">
                    <Link
                      className="btn btn-danger view-btn"
                      onClick={() => onClickData(user)}
                    >
                      Yüklemeleri Sil
                    </Link>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="row g-0 text-center text-sm-start align-items-center mb-3">
        <div className="col-sm-6">
          <div>
            <p className="mb-sm-0">
              Showing 1 to 10 of {userList.length} entries
            </p>
          </div>
        </div>
        <div className="col-sm-6">
          <ul className="pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
            <li className="page-item disabled">
              {" "}
              <Link to="#" className="page-link">
                <i className="mdi mdi-chevron-left"></i>
              </Link>{" "}
            </li>
            <li className="page-item">
              {" "}
              <Link to="#" className="page-link">
                1
              </Link>{" "}
            </li>
            <li className="page-item active">
              {" "}
              <Link to="#" className="page-link">
                2
              </Link>{" "}
            </li>
            <li className="page-item">
              {" "}
              <Link to="#" className="page-link">
                3
              </Link>{" "}
            </li>
            <li className="page-item">
              {" "}
              <Link to="#" className="page-link">
                4
              </Link>{" "}
            </li>
            <li className="page-item">
              {" "}
              <Link to="#" className="page-link">
                5
              </Link>{" "}
            </li>
            <li className="page-item">
              {" "}
              <Link to="#" className="page-link">
                <i className="mdi mdi-chevron-right"></i>
              </Link>{" "}
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TeamTab;
