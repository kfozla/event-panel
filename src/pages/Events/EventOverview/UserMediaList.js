import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  getUserByIdList,
  getUserMediaListById,
} from "../../../slices/users/thunk";

const UserMediaList = () => {
  const { id: userId } = useParams();
  const [username, setUsername] = React.useState("");
  const [mediaList, setMediaList] = React.useState([]);
  const URL = "http://localhost:5176/";

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const userRes = await import("../../../api/user").then((mod) =>
            mod.getUserById(userId)
          );
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center mb-4">
                <h5 className="card-title flex-grow-1">
                  {username} kullanıcısının Yükledikleri
                </h5>
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
                              {/* TODO: Boyut API'den alınabilir */}
                              <td>{media.uploadedOn}</td>
                              <td>
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    tag="a"
                                    href="#"
                                    className="btn btn-soft-primary btn-sm btn-icon"
                                  >
                                    <i className="ri-more-fill"></i>
                                  </DropdownToggle>
                                  <DropdownMenu className="dropdown-menu-end">
                                    <li>
                                      <DropdownItem>
                                        <i className="ri-eye-fill me-2 align-bottom text-muted"></i>
                                        Görüntüle
                                      </DropdownItem>
                                    </li>
                                    <li>
                                      <DropdownItem>
                                        <i className="ri-download-2-fill me-2 align-bottom text-muted"></i>
                                        İndir
                                      </DropdownItem>
                                    </li>
                                    <li className="dropdown-divider"></li>
                                    <li>
                                      <DropdownItem>
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
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserMediaList;
