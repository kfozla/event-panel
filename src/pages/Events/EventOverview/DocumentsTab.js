import React from "react";
import { Link } from "react-router-dom";
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
} from "reactstrap";
import { getAllUsers, getUserMediaCount } from "../../../api/user";
import { deleteMedia } from "../../../api/media";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

const DocumentsTab = ({ mediaList }) => {
  const [usernames, setUsernames] = useState([]);
  const [media, setMedia] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [mediaListState, setMediaListState] = useState(mediaList || []);
  const URL = "http://localhost:5176/";
  useEffect(() => {
    async function fetchUsernames() {
      const users = await getAllUsers();
      const userMediaCounts = await Promise.all(
        users.data.map((user) => getUserMediaCount(user.id))
      );
      const userMap = {};
      users.data.forEach((user, index) => {
        userMap[user.id] = {
          username: user.username,
          mediaCount: userMediaCounts[index].data.count,
        };
      });
      setUsernames(userMap);
    }
    if (mediaList && mediaList.length > 0) {
      fetchUsernames();
      setMediaListState(mediaList);
    }
  }, [mediaList]);
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

  const onClickData = (media) => {
    setMedia(media);
    setDeleteModal(true);
  };

  const handleDeleteEventList = async () => {
    if (media) {
      await deleteMedia(media.id);
      setDeleteModal(false);
      setMediaListState((prev) => prev.filter((m) => m.id !== media.id));
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteEventList()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Card>
        <CardBody>
          <div className="d-flex align-items-center mb-4">
            <h5 className="card-title flex-grow-1">Yüklenenler</h5>
          </div>
          <Row>
            <Col lg={12}>
              <div className="table-responsive table-card">
                <Table className="table-borderless align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Dosya Adı</th>
                      <th scope="col">Dosya Türü</th>
                      <th scope="col">Boyutu</th>
                      <th scope="col">Yükleme Tarihi</th>
                      <th scope="col">Yükleyen</th>
                      <th scope="col" style={{ width: "120px" }}>
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mediaListState && mediaListState.length > 0 ? (
                      mediaListState.map((media, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm">
                                <div className="avatar-title bg-light text-primary rounded fs-24">
                                  {/* TODO */}
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
                                    {media.fileName}
                                  </Link>
                                </h5>
                              </div>
                            </div>
                          </td>
                          <td>{media.fileType}</td>
                          <td>
                            {(media.fileSize / 1024 / 1024).toFixed(2)} MB
                          </td>
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
                            {usernames[media.userId]?.username || "Loading..."}
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
                          No media files found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              {/* Pagination can be added here if needed
              <div className="text-center mt-3">
                <Link to="#" className="text-primary">
                  <i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i>{" "}
                  Load more{" "}
                </Link>
              </div> */}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default DocumentsTab;
