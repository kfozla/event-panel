import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";

//import images
import progileBg from "../../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import {
  uploadPanelUserProfilePicture,
  getPanelUser,
  updatePanelUser,
  changePanelUserPassword,
} from "../../../../api/panelUser";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { set } from "lodash";
import { logoutUser } from "../../../../api/authentication";

const Settings = () => {
  const URL = "http://localhost:5176/";
  const [authUser, setAuthUser] = useState({});

  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      setAuthUser(JSON.parse(sessionStorage.getItem("authUser")));
    }
  }, []);

  useEffect(() => {
    if (authUser && authUser.id) {
      const fetchUser = async () => {
        const user = await getPanelUser(authUser.id);
        setAuthUser(user.data || {});
        console.log(authUser.id);
        console.log("Fetched user:", user);
      };
      fetchUser();
    }
  }, [authUser && authUser.id]);

  const [activeTab, setActiveTab] = useState("1");
  // Şifre göster/gizle için state
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  document.title =
    "Profile Settings | Velzon - React Admin & Dashboard Template";

  // Profil fotoğrafı upload handler
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await uploadPanelUserProfilePicture(authUser.id, file);
      // Upload sonrası kullanıcıyı tekrar çek
      const updatedUser = await getPanelUser(authUser.id);
      setAuthUser((prev) => ({
        ...prev,
        profilePictureUrl: updatedUser.data?.profilePictureUrl || null,
      }));
      // SessionStorage'da da güncelle
      const stored = JSON.parse(sessionStorage.getItem("authUser") || "{}");
      sessionStorage.setItem(
        "authUser",
        JSON.stringify({
          ...stored,
          profilePictureUrl: updatedUser.data?.profilePictureUrl || null,
        })
      );
      toast.success("Profil fotoğrafı yüklendi");
    } catch (err) {
      // Hata yönetimi
      console.error("Upload error:", err);
      toast.error("Profil fotoğrafı yüklenirken hata oluştu");
    }
  };
  const handleUpdate = async () => {
    let user;
    try {
      user = (await getPanelUser(authUser.id)).data;
    } catch (error) {
      toast.error("Kullanıcı bilgileri alınırken hata oluştu");
      return;
    }

    const username = document.getElementById("usernameInput").value;
    const firstName = document.getElementById("firstnameInput").value;
    const lastName = document.getElementById("lastnameInput").value;
    const phoneNumber = document.getElementById("phonenumberInput").value;
    const email = document.getElementById("emailInput").value;

    if (!username || !firstName || !lastName || !phoneNumber || !email) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.email = email;

    try {
      await updatePanelUser(authUser.id, user);
      toast.success("Profil güncellendi");
      // Profil güncellendikten sonra kullanıcıyı tekrar çek
      const updatedUser = await getPanelUser(authUser.id);
      setAuthUser((prev) => ({
        ...prev,
        ...updatedUser.data,
      }));
      // SessionStorage'da da güncelle
      const stored = JSON.parse(sessionStorage.getItem("authUser") || "{}");
      sessionStorage.setItem(
        "authUser",
        JSON.stringify({
          ...stored,
          ...updatedUser.data,
        })
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profil güncellenirken hata oluştu");
    }
  };
  const handlePasswordChange = async () => {
    const oldPassword = document.getElementById("oldpasswordInput").value;
    const newPassword = document.getElementById("newpasswordInput").value;
    const confirmPassword = document.getElementById(
      "confirmpasswordInput"
    ).value;
    if (newPassword !== confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor");
      return;
    }
    try {
      await changePanelUserPassword(authUser.id, oldPassword, newPassword);
      toast.success("Şifre başarıyla değiştirildi. Tekrar Giriş Yapın");
      const updatedUser = await getPanelUser(authUser.id);
      setAuthUser(updatedUser.data || {});
      sessionStorage.setItem(
        "authUser",
        JSON.stringify(updatedUser.data || {})
      );
      // 2 saniye sonra logout
      setTimeout(() => {
        logoutUser();
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Şifre değiştirilemedi, lütfen bilgileri kontrol edin");
    }
  };

  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <div className="page-content mt-4">
        <Container fluid>
          <Row>
            <Col xxl={3}>
              <Card className="mt-n5 ">
                <CardBody className="p-4">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                      {authUser && authUser.profilePictureUrl ? (
                        <img
                          src={
                            URL +
                            authUser.profilePictureUrl +
                            "?t=" +
                            new Date().getTime()
                          }
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                          alt="user-profile"
                        />
                      ) : (
                        <div
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image d-flex align-items-center justify-content-center"
                          style={{
                            width: 120,
                            height: 120,
                            background: "#e0e0e0",
                            color: "#888",
                            fontSize: 48,
                            fontWeight: 600,
                          }}
                        >
                          <i className="ri-user-line"></i>
                        </div>
                      )}
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <Input
                          id="profile-img-file-input"
                          type="file"
                          className="profile-img-file-input"
                          onChange={handleUpload}
                          accept="image/*"
                        />
                        <Label
                          htmlFor="profile-img-file-input"
                          className="profile-photo-edit avatar-xs"
                        >
                          <span className="avatar-title rounded-circle bg-light text-body">
                            <i className="ri-camera-fill"></i>
                          </span>
                        </Label>
                      </div>
                    </div>
                    <h5 className="fs-16 mb-1">{authUser.username}</h5>
                    <p className="text-muted mb-0">Lead Designer / Developer</p>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-0">Aktif Hizmet Paketi</h5>
                    </div>
                    <div className="flex-shrink-0 ">
                      <Link to="#" className="badge bg-primary fs-12">
                        <i className="ri-add-fill align-bottom me-1"></i>{" "}
                        Değiştir
                      </Link>
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
                      <div className="fw-bold fs-15">Başlangıç Paketi</div>
                      <div className="text-muted small">12 Ay - Aktif</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xxl={9}>
              <Card className="mt-xxl-n5">
                <CardHeader>
                  <Nav
                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                          tabChange("1");
                        }}
                      >
                        <i className="fas fa-home"></i>
                        Kişisel Bilgiler
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                          tabChange("2");
                        }}
                        type="button"
                      >
                        <i className="far fa-user"></i>
                        Şifre Değiştir
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>
                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Form>
                        <Row>
                          <Col lg={12}>
                            <Row className="g-2">
                              <Col md={4}>
                                <div className="mb-2">
                                  <Label
                                    htmlFor="usernameInput"
                                    className="form-label"
                                  >
                                    Kullanıcı Adı
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="usernameInput"
                                    placeholder="Kullanıcı adınızı girin"
                                    defaultValue={authUser.username || ""}
                                  />
                                </div>
                              </Col>
                              <Col md={4}>
                                <div className="mb-2">
                                  <Label
                                    htmlFor="firstnameInput"
                                    className="form-label"
                                  >
                                    İsim
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="firstnameInput"
                                    placeholder="İsminizi Girin"
                                    defaultValue={authUser.firstName || ""}
                                  />
                                </div>
                              </Col>
                              <Col md={4}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="lastnameInput"
                                    className="form-label"
                                  >
                                    Soyisim
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="lastnameInput"
                                    placeholder="Soyisminizi Girin"
                                    defaultValue={authUser.lastName || ""}
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={12}>
                            <Row className="g-2">
                              <Col md={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="phonenumberInput"
                                    className="form-label"
                                  >
                                    Telefon Numarası
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="phonenumberInput"
                                    placeholder="Telefon numaranızı girin"
                                    defaultValue={authUser.phoneNumber || ""}
                                  />
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="emailInput"
                                    className="form-label"
                                  >
                                    Email
                                  </Label>
                                  <Input
                                    type="email"
                                    className="form-control"
                                    id="emailInput"
                                    placeholder="Email adresinizi girin"
                                    defaultValue={authUser.email || ""}
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          <Col lg={12}>
                            <div className="hstack gap-2 justify-content-end">
                              <button
                                type="button"
                                className="btn btn-soft-secondary"
                              >
                                İptal
                              </button>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => handleUpdate()}
                              >
                                Güncelle
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>

                    <TabPane tabId="2">
                      <Form>
                        <Row className="g-2">
                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="oldpasswordInput"
                                className="form-label"
                              >
                                Eski Şifre*
                              </Label>
                              <div className="input-group">
                                <Input
                                  type={showOldPassword ? "text" : "password"}
                                  className="form-control"
                                  id="oldpasswordInput"
                                  placeholder="Mevcut şifreyi girin"
                                  required
                                />
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  tabIndex={-1}
                                  onClick={() => setShowOldPassword((v) => !v)}
                                  style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                  }}
                                >
                                  <i
                                    className={
                                      showOldPassword
                                        ? "ri-eye-off-line"
                                        : "ri-eye-line"
                                    }
                                  ></i>
                                </button>
                              </div>
                            </div>
                          </Col>

                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="newpasswordInput"
                                className="form-label"
                              >
                                Yeni Şifre*
                              </Label>
                              <div className="input-group">
                                <Input
                                  type={showNewPassword ? "text" : "password"}
                                  className="form-control"
                                  id="newpasswordInput"
                                  placeholder="Yeni şifreyi girin"
                                  required
                                />
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  tabIndex={-1}
                                  onClick={() => setShowNewPassword((v) => !v)}
                                  style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                  }}
                                >
                                  <i
                                    className={
                                      showNewPassword
                                        ? "ri-eye-off-line"
                                        : "ri-eye-line"
                                    }
                                  ></i>
                                </button>
                              </div>
                            </div>
                          </Col>

                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="confirmpasswordInput"
                                className="form-label"
                              >
                                Şifreyi Onayla*
                              </Label>
                              <div className="input-group">
                                <Input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  className="form-control"
                                  id="confirmpasswordInput"
                                  placeholder="Şifreyi onaylayın"
                                  required
                                />
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  tabIndex={-1}
                                  onClick={() =>
                                    setShowConfirmPassword((v) => !v)
                                  }
                                  style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                  }}
                                >
                                  <i
                                    className={
                                      showConfirmPassword
                                        ? "ri-eye-off-line"
                                        : "ri-eye-line"
                                    }
                                  ></i>
                                </button>
                              </div>
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div className="mb-3">
                              <Link
                                to="#"
                                className="link-primary text-decoration-underline"
                              >
                                Şifremi unuttum ?
                              </Link>
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div className="text-end">
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => handlePasswordChange()}
                              >
                                Şifre Değiştir
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                      <div className="mt-4 mb-3 border-bottom pb-2">
                        <div className="float-end">
                          <Link to="#" className="link-secondary">
                            All Logout
                          </Link>
                        </div>
                        <h5 className="card-title">Login History</h5>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <div className="flex-shrink-0 avatar-sm">
                          <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                            <i className="ri-smartphone-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6>iPhone 12 Pro</h6>
                          <p className="text-muted mb-0">
                            Los Angeles, United States - March 16 at 2:47PM
                          </p>
                        </div>
                        <div>
                          <Link to="#">Logout</Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <div className="flex-shrink-0 avatar-sm">
                          <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                            <i className="ri-tablet-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6>Apple iPad Pro</h6>
                          <p className="text-muted mb-0">
                            Washington, United States - November 06 at 10:43AM
                          </p>
                        </div>
                        <div>
                          <Link to="#" className="link-secondary">
                            Logout
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <div className="flex-shrink-0 avatar-sm">
                          <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                            <i className="ri-smartphone-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6>Galaxy S21 Ultra 5G</h6>
                          <p className="text-muted mb-0">
                            Conneticut, United States - June 12 at 3:24PM
                          </p>
                        </div>
                        <div>
                          <Link to="#" className="link-secondary">
                            Logout
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 avatar-sm">
                          <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                            <i className="ri-macbook-line"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6>Dell Inspiron 14</h6>
                          <p className="text-muted mb-0">
                            Phoenix, United States - July 26 at 8:10AM
                          </p>
                        </div>
                        <div>
                          <Link to="#" className="link-secondary">
                            Logout
                          </Link>
                        </div>
                      </div>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Settings;
