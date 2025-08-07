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
import {
  getUserMediaCount,
  addUser,
  uploadMedia,
  getUserByUsernameandSession,
} from "../../../api/user";
import { deleteMedia } from "../../../api/media";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { t } from "i18next";

const DocumentsTab = ({ mediaList, userList, eventId }) => {
  const [usernames, setUsernames] = useState([]);
  const [expandedFileIndex, setExpandedFileIndex] = useState(null);
  const [media, setMedia] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [mediaListState, setMediaListState] = useState(mediaList || []);
  const URL = "http://localhost:5176/";
  useEffect(() => {
    console.log("userList", userList);
    async function fetchUsernames() {
      const users = userList;
      const userMediaCounts = await Promise.all(
        users.map((user) => getUserMediaCount(user.id))
      );
      const userMap = {};
      users.forEach((user, index) => {
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const files = formData.getAll("documentFile");
      if (!files || files.length === 0) {
        toast.error("Lütfen bir dosya seçin.");
        return;
      }
      const username = formData.get("username");
      if (!username) {
        toast.error("Lütfen bir kullanıcı seçin.");
        return;
      }
      document.cookie = "username=" + username + "; path=/";
      // Eğer sessionId cookie'si yoksa oluştur
      let sessionId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sessionId="))
        ?.split("=")[1];
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now();
        document.cookie = "sessionId=" + sessionId + "; path=/";
      }
      let userResponse;
      try {
        const res = await getUserByUsernameandSession(username, sessionId);
        if (res && res.data) {
          userResponse = res.data;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // kullanıcı yok, ekleyeceğiz
        } else {
          console.error("Kullanıcı sorgulama hatası:", error);
          toast.error("Kullanıcı sorgulanırken bir hata oluştu.");
          return;
        }
      }
      if (!userResponse) {
        try {
          const addRes = await addUser({ username, sessionId, eventId });
          userResponse = addRes.data;
        } catch (error) {
          console.error("Kullanıcı ekleme hatası:", error);
          toast.error("Kullanıcı eklerken bir hata oluştu.");
          return;
        }
      }
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("username", userResponse.username);
        uploadFormData.append("sessionId", sessionId);
        files.forEach((file) => {
          uploadFormData.append("file", file);
        });
        const uploadResponse = await uploadMedia(uploadFormData);
      } catch (error) {
        console.error("Dosya yükleme hatası:", error);
        toast.error("Dosya yüklerken bir hata oluştu.");
        return;
      }
      toast.success("Dosya başarıyla yüklendi.");
    } catch (error) {
      console.error("Form gönderme hatası:", error);
      toast.error("Dosya yüklerken bir hata oluştu.");
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteEventList()}
        onCloseClick={() => setDeleteModal(false)}
        headerText="Medya Sil"
        content="Bu içeriği silmek istediğinize emin misiniz?"
      />
      <Row>
        <Col lg={9}>
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
                                      <span
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        title={media.fileName}
                                        onClick={() =>
                                          setExpandedFileIndex(
                                            expandedFileIndex === index
                                              ? null
                                              : index
                                          )
                                        }
                                      >
                                        {expandedFileIndex === index
                                          ? media.fileName
                                          : media.fileName.length > 20
                                          ? media.fileName.slice(0, 17) + "..."
                                          : media.fileName}
                                      </span>
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
                                {usernames[media.userId]?.username ||
                                  "Loading..."}
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
        </Col>
        <Col lg={3}>
          <Card>
            <form className="p-4" onSubmit={(e) => handleFormSubmit(e)}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter username"
                  name="username"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="documentFile" className="form-label">
                  Medya Yükle
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="form-control"
                  multiple
                  required
                  id="documentFile"
                  name="documentFile"
                />
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">
                  Yükle
                </button>
              </div>
            </form>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DocumentsTab;
