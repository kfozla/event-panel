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

import { createServicePackage } from "../../api/servicePackages";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { logoutUser } from "../../api/authentication";
import { add } from "lodash";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";

const AddServicePackage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  document.title = "Hizmet Paketi Ekle | Velzon";

  // Formik setup for service package
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      durationMonth: "",
      maxEvents: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Başlık zorunlu"),
      description: Yup.string().required("Açıklama zorunlu"),
      durationMonth: Yup.number()
        .typeError("Sayı girin")
        .min(1, "En az 1 ay olmalı")
        .max(36, "En fazla 36 ay olabilir")
        .required("Aktiflik süresi zorunlu"),
      maxEvents: Yup.number()
        .typeError("Sayı girin")
        .min(1, "En az 1 olmalı")
        .required("Etkinlik limiti zorunlu"),
      price: Yup.number()
        .typeError("Sayı girin")
        .min(0, "Fiyat 0'dan küçük olamaz")
        .required("Fiyat zorunlu"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          title: values.title,
          description: values.description,
          activeFor: Number(values.durationMonth),
          maxEvents: Number(values.maxEvents),
          price: Number(values.price),
        };
        await createServicePackage(payload);
        toast.success("Hizmet paketi eklendi");
        setTimeout(() => {
          navigate("/apps-service-packages");
        }, 1000);
        resetForm();
      } catch (error) {
        toast.error("Hizmet paketi eklenirken hata oluştu");
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
                        Hizmet Paketi Ekle
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>
                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Form onSubmit={formik.handleSubmit}>
                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="titleInput"
                                className="form-label"
                              >
                                Başlık
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="titleInput"
                                name="title"
                                placeholder="Paket başlığı girin"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.title && !!formik.errors.title
                                }
                              />
                              {formik.touched.title && formik.errors.title && (
                                <div className="text-danger small">
                                  {formik.errors.title}
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="durationMonthInput"
                                className="form-label"
                              >
                                Süre (Ay)
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="durationMonthInput"
                                name="durationMonth"
                                placeholder="Ay sayısı girin"
                                min={1}
                                max={36}
                                value={formik.values.durationMonth}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.durationMonth &&
                                  !!formik.errors.durationMonth
                                }
                              />
                              {formik.touched.durationMonth &&
                                formik.errors.durationMonth && (
                                  <div className="text-danger small">
                                    {formik.errors.durationMonth}
                                  </div>
                                )}
                            </div>
                          </Col>
                          <Col md={12}>
                            <div className="mb-3">
                              <Label
                                htmlFor="descriptionInput"
                                className="form-label"
                              >
                                Açıklama
                              </Label>
                              <Input
                                type="textarea"
                                className="form-control"
                                id="descriptionInput"
                                name="description"
                                placeholder="Paket açıklaması girin"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.description &&
                                  !!formik.errors.description
                                }
                              />
                              {formik.touched.description &&
                                formik.errors.description && (
                                  <div className="text-danger small">
                                    {formik.errors.description}
                                  </div>
                                )}
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="maxEventsInput"
                                className="form-label"
                              >
                                Etkinlik Limiti
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="maxEventsInput"
                                name="maxEvents"
                                placeholder="Etkinlik limiti girin"
                                value={formik.values.maxEvents}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.maxEvents &&
                                  !!formik.errors.maxEvents
                                }
                              />
                              {formik.touched.maxEvents &&
                                formik.errors.maxEvents && (
                                  <div className="text-danger small">
                                    {formik.errors.maxEvents}
                                  </div>
                                )}
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="priceInput"
                                className="form-label"
                              >
                                Fiyat
                              </Label>
                              <Input
                                type="number"
                                className="form-control"
                                id="priceInput"
                                name="price"
                                placeholder="Fiyat girin"
                                value={formik.values.price || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.price && !!formik.errors.price
                                }
                              />
                              {formik.touched.price && formik.errors.price && (
                                <div className="text-danger small">
                                  {formik.errors.price}
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col md={12}>
                            <div className="hstack gap-2 justify-content-end">
                              <button
                                type="button"
                                className="btn btn-soft-secondary"
                                onClick={() => navigate(-1)}
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
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddServicePackage;
