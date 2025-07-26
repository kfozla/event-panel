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

const DocumentsTab = ({ mediaList }) => {
  console.log("Media List:", mediaList);
  return (
    <React.Fragment>
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
                      <th scope="col" style={{ width: "120px" }}>
                        İşlemler
                      </th>
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
                                  <i className="ri-folder-zip-line"></i>
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
                          <td>Zip File</td>
                          <td>4.57 MB</td>
                          <td>{mediaList[index].uploadedOn}</td>
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
                          No media files found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="text-center mt-3">
                <Link to="#" className="text-primary">
                  <i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i>{" "}
                  Load more{" "}
                </Link>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default DocumentsTab;
