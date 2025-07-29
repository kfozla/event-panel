import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Table,
  UncontrolledDropdown,
  Container,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { deleteMedia } from "../../../api/media";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer } from "react-toastify";
import { CardHeader } from "reactstrap";
import SimpleBar from "simplebar-react";
import { getEventUserList } from "../../../api/events";

const UserMediaList = () => {
  const { id: userId } = useParams();
  const [username, setUsername] = React.useState("");
  const [mediaList, setMediaList] = React.useState([]);
  const URL = "http://localhost:5176/";

  const [eventId, setEventId] = useState();

  const [media, setMedia] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [eventUserList, setEventUserList] = useState([]);

  // eventId güncellendiğinde eventUserList'i fetch etme işlemini userId ile birlikte ana useEffect'e taşıyoruz
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const userRes = await import("../../../api/user").then((mod) =>
            mod.getUserById(userId)
          );
          setEventId(userRes.data?.eventId);
          setUsername(userRes.data?.username || "Unknown");
          const mediaRes = await import("../../../api/user").then((mod) =>
            mod.getUserMediaList(userId)
          );
          setMediaList(mediaRes.data || []);
          // eventId geldiyse burada user listesi de çekilsin
          console.log("UserRes:", userRes.data.eventId);
          if (userRes.data?.eventId) {
            const userList = await getEventUserList(userRes.data.eventId);
            setEventUserList(userList || []);
          } else {
            setEventUserList([]);
          }
        } catch (err) {
          setUsername("Unknown");
          setMediaList([]);
          setEventUserList([]);
        }
      }
    };
    fetchData();
  }, [userId]);

  const onClickData = (media) => {
    setMedia(media);
    setDeleteModal(true);
  };
  // Silme işlemi

  const handleDeleteEventList = async () => {
    if (media) {
      await deleteMedia(media.id);
      setDeleteModal(false);
      // Silme sonrası media listesini güncelle
      try {
        const mediaRes = await import("../../../api/user").then((mod) =>
          mod.getUserMediaList(userId)
        );
        setMediaList(mediaRes.data || []);
      } catch (err) {
        setMediaList([]);
      }
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("İndirme hatası:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const userRes = await import("../../../api/user").then((mod) =>
            mod.getUserById(userId)
          );
          setEventId(userRes.data?.eventId);
          setUsername(userRes.data?.username || "Unknown");
          const mediaRes = await import("../../../api/user").then((mod) =>
            mod.getUserMediaList(userId)
          );
          setMediaList(mediaRes.data || []);
        } catch (err) {
          setUsername("Unknown");
          setMediaList([]);
        }
      }
    };
    fetchData();
  }, [userId]);
  const truncateText = (text, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteEventList()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Row className="g-4 mb-3">
            <Col xl={9} lg={8}>
              <Card>
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <h5 className="card-title flex-grow-1">
                      {username} kullanıcısının Yükledikleri
                    </h5>
                  </div>
                  <div className="table-responsive table-card">
                    <Table className="table-borderless align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Dosya Adı</th>
                          <th scope="col">Dosya Türü</th>
                          <th scope="col">Boyutu</th>
                          <th scope="col">Yükleme Tarihi</th>
                          <th scope="col">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mediaList && mediaList.length > 0 ? (
                          mediaList.map((media, index) => (
                            <tr key={index}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm">
                                    <div className="avatar-title bg-light text-primary rounded fs-24">
                                      <img
                                        src={`${URL + media.filePath}`}
                                        alt={media.fileName}
                                        height={40}
                                        width={40}
                                      />
                                    </div>
                                  </div>
                                  <div className="ms-3 flex-grow-1">
                                    <h5 className="fs-14 mb-0">
                                      <Link to="#" className="text-dark">
                                        {truncateText(media.fileName)}
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{media.fileType}</td>
                              <td>
                                {(media.fileSize / 1024 / 1024).toFixed(2)} MB
                              </td>
                              {/* TODO: Boyut API'den alınabilir */}
                              <td>
                                {media.uploadedOn
                                  ? new Date(media.uploadedOn).toLocaleString(
                                      "tr-TR",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )
                                  : ""}
                              </td>
                              <td>
                                <UncontrolledDropdown direction="left">
                                  <DropdownToggle
                                    tag="a"
                                    href="#"
                                    className="btn btn-soft-primary btn-sm btn-icon"
                                  >
                                    <i className="ri-more-fill"></i>
                                  </DropdownToggle>
                                  <DropdownMenu className="dropdown-menu-end">
                                    <li>
                                      <DropdownItem
                                        onClick={() =>
                                          window.open(
                                            URL + media.filePath,
                                            "_blank"
                                          )
                                        }
                                      >
                                        <i className="ri-eye-fill me-2 align-bottom text-muted"></i>
                                        Görüntüle
                                      </DropdownItem>
                                    </li>
                                    <li>
                                      <DropdownItem
                                        onClick={() =>
                                          handleDownload(
                                            URL + media.filePath,
                                            media.fileName
                                          )
                                        }
                                      >
                                        <i className="ri-download-2-fill me-2 align-bottom text-muted"></i>
                                        İndir
                                      </DropdownItem>
                                    </li>
                                    <li className="dropdown-divider"></li>
                                    <li>
                                      <DropdownItem
                                        onClick={() => onClickData(media)}
                                      >
                                        <i className="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>
                                        Sil
                                      </DropdownItem>
                                    </li>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              Yüklenen medya bulunamadı.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
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
                      {eventUserList && eventUserList.length > 0
                        ? eventUserList.map((user, index) => {
                            return (
                              <div className="vstack gap-3" key={index}>
                                <div className="d-flex align-items-center">
                                  <div className="flex-grow-1">
                                    <h5 className="fs-13 mb-0">
                                      <Link
                                        to="#"
                                        className="text-dark d-block"
                                      >
                                        {user.username || "Nancy Martino"}
                                      </Link>
                                    </h5>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <div className="d-flex align-items-center gap-1">
                                      <Link
                                        to={`/apps-events-user-medialist/${user.id}`}
                                        className="btn btn-light view-btn"
                                      >
                                        Yükledikleri
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        : null}
                    </div>
                  </SimpleBar>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserMediaList;
