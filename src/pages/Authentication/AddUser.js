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

import {
  uploadPanelUserProfilePicture,
  getPanelUser,
  addPanelUser,
  changePanelUserPassword,
} from "../../api/panelUser";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { logoutUser } from "../../api/authentication";
import { add } from "lodash";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";

const AddUser = () => {
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  document.title =
    "Profile Settings | Velzon - React Admin & Dashboard Template";

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Kullanıcı adı en az 3 karakter olmalı")
        .required("Kullanıcı adı zorunlu"),
      firstName: Yup.string()
        .min(2, "İsim en az 2 karakter olmalı")
        .required("İsim zorunlu"),
      lastName: Yup.string()
        .min(2, "Soyisim en az 2 karakter olmalı")
        .required("Soyisim zorunlu"),
      phoneNumber: Yup.string()
        .matches(
          /^\d{10,15}$/,
          "Telefon numarası 10-15 haneli ve sadece rakam olmalı"
        )
        .required("Telefon numarası zorunlu"),
      email: Yup.string()
        .email("Geçerli bir e-posta adresi girin")
        .required("Email zorunlu"),
      password: Yup.string()
        .min(8, "Şifre en az 8 karakter olmalı")
        .required("Şifre zorunlu"),
      role: Yup.string().required("Rol seçimi zorunlu"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await addPanelUser(values);
        toast.success("Kullanıcı Eklendi");
        setTimeout(() => {
          navigate("/apps-list-users");
        }, 1000);
        resetForm();
      } catch (error) {
        console.error("Error adding user:", error);
        toast.error("Kullanıcı eklenirken hata oluştu");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      <div className="page-content mt-4">
        <Container fluid>
          <Row>
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
                        Kullanıcı Ekle
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>
                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Form onSubmit={formik.handleSubmit}>
                        <Row>
                          <Col lg={12}>
                            <Row className="g-2">
                              <Col md={6}>
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
                                    name="username"
                                    placeholder="Kullanıcı adınızı girin"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={
                                      formik.touched.username &&
                                      !!formik.errors.username
                                    }
                                  />
                                  {formik.touched.username &&
                                    formik.errors.username && (
                                      <div className="text-danger small">
                                        {formik.errors.username}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="emailInput"
                                    className="form-label"
                                  >
                                    Şifre
                                  </Label>
                                  <Input
                                    type="password"
                                    className="form-control"
                                    id="passwordInput"
                                    name="password"
                                    placeholder="Şifrenizi girin"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={
                                      formik.touched.password &&
                                      !!formik.errors.password
                                    }
                                  />
                                  {formik.touched.password &&
                                    formik.errors.password && (
                                      <div className="text-danger small">
                                        {formik.errors.password}
                                      </div>
                                    )}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={12}>
                            <Row className="g-2">
                              <Col md={6}>
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
                                    name="firstName"
                                    placeholder="İsminizi Girin"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={
                                      formik.touched.firstName &&
                                      !!formik.errors.firstName
                                    }
                                  />
                                  {formik.touched.firstName &&
                                    formik.errors.firstName && (
                                      <div className="text-danger small">
                                        {formik.errors.firstName}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col md={6}>
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
                                    name="lastName"
                                    placeholder="Soyisminizi Girin"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={
                                      formik.touched.lastName &&
                                      !!formik.errors.lastName
                                    }
                                  />
                                  {formik.touched.lastName &&
                                    formik.errors.lastName && (
                                      <div className="text-danger small">
                                        {formik.errors.lastName}
                                      </div>
                                    )}
                                </div>
                              </Col>
                            </Row>
                            <Row className="g-2">
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
                                    name="email"
                                    placeholder="Email adresinizi girin"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={
                                      formik.touched.email &&
                                      !!formik.errors.email
                                    }
                                  />
                                  {formik.touched.email &&
                                    formik.errors.email && (
                                      <div className="text-danger small">
                                        {formik.errors.email}
                                      </div>
                                    )}
                                </div>
                              </Col>
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
                                    name="phoneNumber"
                                    placeholder="Telefon numaranızı girin"
                                    value={formik.values.phoneNumber}
                                    onChange={(e) => {
                                      // Sadece rakam girilsin
                                      const val = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      formik.setFieldValue("phoneNumber", val);
                                    }}
                                    onBlur={formik.handleBlur}
                                    invalid={
                                      formik.touched.phoneNumber &&
                                      !!formik.errors.phoneNumber
                                    }
                                  />
                                  {formik.touched.phoneNumber &&
                                    formik.errors.phoneNumber && (
                                      <div className="text-danger small">
                                        {formik.errors.phoneNumber}
                                      </div>
                                    )}
                                </div>
                              </Col>
                            </Row>
                            <Row className="g-2">
                              <Col md={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="roleInput"
                                    className="form-label"
                                  >
                                    Rol
                                  </Label>
                                  <Input
                                    type="select"
                                    className="form-select"
                                    id="roleInput"
                                    name="role"
                                    value={formik.values.role}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={
                                      formik.touched.role &&
                                      !!formik.errors.role
                                    }
                                  >
                                    <option value="">Seçiniz</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">Kullanıcı</option>
                                  </Input>
                                  {formik.touched.role &&
                                    formik.errors.role && (
                                      <div className="text-danger small">
                                        {formik.errors.role}
                                      </div>
                                    )}
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
                                type="submit"
                                className="btn btn-primary"
                                disabled={formik.isSubmitting}
                              >
                                {formik.isSubmitting ? "Ekleniyor..." : "Ekle"}
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
            <Col xxl={3} className="mt-xxl-n4">
              <Card>
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-0">Hizmet Paketi Seç</h5>
                    </div>
                    <div className="flex-shrink-0 ">
                      <Link to="#" className="badge bg-primary fs-12">
                        <i className="ri-add-fill align-bottom me-1"></i> Seç
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
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddUser;
