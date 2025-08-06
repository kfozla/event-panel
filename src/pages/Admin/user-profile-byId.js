import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import avatar from "../../assets/images/users/avatar-1.jpg";
import { useParams } from "react-router-dom";
import { getPanelUserById } from "../../api/panelUser";

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

const UserProfileById = () => {
  const URL = process.env.REACT_APP_API_REAL_URL;
  const [panelUser, setPanelUser] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getPanelUserById(id);
        setPanelUser(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  document.title = "Profile | Velzon - React Admin & Dashboard Template";
  console.log("panelUser:", panelUser);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col>
              <Card>
                <CardBody>
                  <Row className="mb-2">
                    <Col md={12}>
                      <h5 className="mb-4">Profil Detayları</h5>
                      <div className="d-flex align-items-center mb-4">
                        {panelUser.profilePictureUrl ? (
                          <img
                            src={
                              URL +
                              panelUser.profilePictureUrl +
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
                          <h4 className="mb-1">{panelUser.username || ""} </h4>
                          <div className="text-muted">{panelUser.email}</div>
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div
                        className="mb-3 d-flex align-items-center paket-card bg-light "
                        style={{
                          cursor: "pointer",
                          borderRadius: "8px",
                          padding: "12px 16px",

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
                          <div className="fw-bold fs-15 text-primary">
                            Başlangıç Paketi
                          </div>
                          <div className="text-muted small">12 Ay - Aktif</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div>
                    <Row className="border-top pt-3">
                      <Col md="4" className="mb-3">
                        <div className="fw-semibold">İsim Soyisim</div>
                        <div className="text-muted">
                          {panelUser.firstName || panelUser.first_name || ""}{" "}
                          {panelUser.lastName || panelUser.last_name || ""}
                        </div>
                      </Col>
                      <Col md="4" className="mb-3">
                        <div className="fw-semibold">Email</div>
                        <div className="text-muted">{panelUser.email}</div>
                      </Col>
                      <Col md="4" className="mb-3">
                        <div className="fw-semibold">Rol</div>
                        <div className="text-muted">{panelUser.role}</div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="4" className="mb-3">
                        <div className="fw-semibold">Telefon Numarası</div>
                        <div className="text-muted">
                          {panelUser.phoneNumber || ""}
                        </div>
                      </Col>
                      <Col md="4" className="mb-3">
                        <div className="fw-semibold">Oluşturulma Tarihi</div>
                        <div className="text-muted">
                          {formatDate(panelUser.createdOn)}
                        </div>
                      </Col>
                      <Col md="4" className="mb-3">
                        <div className="fw-semibold">
                          Son Güncellenme Tarihi
                        </div>
                        <div className="text-muted">
                          {formatDate(panelUser.modifiedOn)}
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

export default UserProfileById;
