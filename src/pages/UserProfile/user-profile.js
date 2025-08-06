import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import avatar from "../../assets/images/users/avatar-1.jpg";
import { getServicePackageById } from "../../api/servicePackages";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UserProfile = () => {
  const URL = process.env.REACT_APP_API_REAL_URL;

  const [authUser, setAuthUser] = useState({});
  const [activePackage, setActivePackage] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      setAuthUser(JSON.parse(sessionStorage.getItem("authUser")));
    }
  }, []);
  useEffect(() => {
    if (authUser && authUser.servicePackageId) {
      const fetchPackage = async () => {
        try {
          const response = await getServicePackageById(
            authUser.servicePackageId
          );
          // Bazı API'lerde response.data, bazılarında response olabilir. İkisini de kontrol et.
          if (response && response.data) {
            setActivePackage(response.data);
          } else if (response) {
            setActivePackage(response);
          } else {
            setActivePackage(null);
          }
        } catch (error) {
          setActivePackage(null);
          console.error("Error fetching service package:", error);
        }
      };
      fetchPackage();
    } else {
      setActivePackage(null);
    }
  }, [authUser && authUser.servicePackageId]);

  document.title = "Profile | Velzon - React Admin & Dashboard Template";
  console.log("authUser:", authUser);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-2">
                    <Col md={8}>
                      <h5 className="mb-4">Profil Detayları</h5>
                      <div className="d-flex align-items-center mb-4">
                        {authUser.profilePictureUrl ? (
                          <img
                            src={
                              URL +
                              authUser.profilePictureUrl +
                              "?t=" +
                              new Date().getTime()
                            }
                            alt="Profile"
                            className="rounded-circle avatar-lg img-thumbnail me-3"
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded-circle avatar-lg img-thumbnail me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: 80,
                              height: 80,
                              background: "#e0e0e0",
                              color: "#888",
                              fontSize: 32,
                              fontWeight: 600,
                            }}
                          >
                            <i className="ri-user-line"></i>
                          </div>
                        )}
                        <div>
                          <h4 className="mb-1">{authUser.username || ""} </h4>
                          <div className="text-muted">{authUser.email}</div>
                        </div>
                      </div>
                    </Col>
                    {activePackage && (
                      <Col md={4}>
                        <div className="">
                          <div className="d-flex align-items-center mb-4">
                            <div className="flex-grow-1">
                              <h5 className="card-title mb-0">
                                Aktif Hizmet Paketi
                              </h5>
                            </div>
                            <div className="flex-shrink-0 ">
                              <button
                                type="button"
                                className="badge bg-primary fs-12 border-0"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  navigate("/pages-profile-settings")
                                }
                              >
                                <i className="ri-add-fill align-bottom me-1"></i>{" "}
                                Değiştir
                              </button>
                            </div>
                          </div>
                          <div
                            className="mb-3 d-flex align-items-center paket-card"
                            style={{
                              cursor: "pointer",
                              borderRadius: "8px",
                              padding: "12px 16px",
                              background: "#f8f9fa",
                              transition: "box-shadow 0.2s",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                            }}
                            onClick={() => {
                              /* popup açma fonksiyonu */
                            }}
                          >
                            <div className="avatar-xs d-block flex-shrink-0 me-3">
                              <span className="avatar-title rounded-circle fs-16 bg-primary-subtle text-primary">
                                <i className="ri-global-fill"></i>
                              </span>
                            </div>
                            <div>
                              <div className="fw-bold fs-15">
                                {activePackage?.title}
                              </div>
                              <div className="text-muted small">
                                {activePackage.activeFor} Ay - Aktif
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                  <div>
                    <Row className="border-top pt-3">
                      <Col md="4" className="mb-3">
                        <div className="fw-semibold">İsim Soyisim</div>
                        <div className="text-muted">
                          {authUser.firstName || authUser.first_name || ""}{" "}
                          {authUser.lastName || authUser.last_name || ""}
                        </div>
                      </Col>
                      <Col md="4" className="mb-3">
                        <div className="fw-semibold">Email</div>
                        <div className="text-muted">{authUser.email}</div>
                      </Col>
                      <Col md="4" className="mb-3">
                        <div className="fw-semibold">Rol</div>
                        <div className="text-muted">{authUser.role}</div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" className="mb-3">
                        <div className="fw-semibold">Telefon Numarası</div>
                        <div className="text-muted">
                          {authUser.phoneNumber || ""}
                        </div>
                      </Col>
                      <Col md="4" className="mb-3">
                        <div className="fw-semibold">Oluşturulma Tarihi</div>
                        <div className="text-muted">
                          {formatDate(authUser.createdOn)}
                        </div>
                      </Col>
                      <Col md="4" className="mb-3">
                        <div className="fw-semibold">
                          Son Güncellenme Tarihi
                        </div>
                        <div className="text-muted">
                          {formatDate(authUser.modifiedOn)}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
