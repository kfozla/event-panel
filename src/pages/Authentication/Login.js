import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import apiClient from "../../api/apiClient";

//redux

import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import logoLight from "../../assets/images/bocek.svg";
import { loginUser, getLoggedInUser } from "../../api/authentication";

const Login = () => {
  const history = useNavigate();
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Lütfen Kullanıcı Adı Girin"),
      password: Yup.string().required("Lütfen Şifrenizi Girin"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        console.log("test1");

        let res;
        try {
          res = await loginUser({
            username: values.username,
            password: values.password,
          });
        } catch (err) {
          setError("Giriş bilgelirinizi kontrol edin");
          setLoading(false);
          return;
        }

        console.log("test2");

        console.log("Login Response:", res);

        if (res == null || !res || res.status == 401) {
          console.log("test3");

          setError("Giriş başarısız. Lütfen tekrar deneyin.");
          setLoading(false);
          return;
        } else {
          sessionStorage.setItem("token", res.accessToken);
          sessionStorage.setItem("refreshToken", res.refreshToken);

          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.accessToken}`;
          console.log("Login Response:", res);
          const userObj = await getLoggedInUser();
          const authUser = {
            ...userObj,

            username: userObj.username,
            first_name: userObj.firstName || "",
            last_name: userObj.lastName || "",
            token: res.accessToken,
            role: userObj.role || "user",
            refreshToken: res.refreshToken,
            email: userObj.email || "",
            profilePictureUrl: userObj.profilePictureUrl || null,
            servicePackageId: userObj.servicePackageId || null,
            servicePackageExpiration: userObj.servicePackageExpiration || null,
            servicePackageAdded: userObj.servicePackageAdded || null,
          };
          sessionStorage.setItem("authUser", JSON.stringify(authUser));

          // Başarılı girişte yönlendir
          history("/dashboard");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Giriş sırasında bir hata oluştu. "
        );
      } finally {
        setLoading(false);
      }
    },
  });

  document.title = "Basic SignIn | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="80" />
                    </Link>
                  </div>
                  <p className="mt-3 fs-15 fw-medium">
                    Böceksoft Admin & Yönetim Paneli
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Hoşgeldiniz!</h5>
                      <p className="text-muted">
                        Devam Etmek için lütfen giriş yapın.
                      </p>
                    </div>
                    {error && <Alert color="danger"> {error} </Alert>}{" "}
                    <div className="p-2 mt-4">
                      <Form onSubmit={validation.handleSubmit} action="#">
                        <div className="mb-3">
                          <Label htmlFor="username" className="form-label">
                            Kullanıcı Adı
                          </Label>
                          <Input
                            name="username"
                            className="form-control"
                            placeholder="Kullanıcı adı girin"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.username || ""}
                            invalid={
                              validation.touched.username &&
                              validation.errors.username
                                ? true
                                : false
                            }
                            autoComplete="username"
                          />
                          {validation.touched.username &&
                          validation.errors.username ? (
                            <FormFeedback type="invalid">
                              {validation.errors.username}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <div className="float-end">
                            <Link
                              to="/forgot-password"
                              className="text-muted"
                              tabIndex={-1}
                            >
                              Şifremi Unuttum?
                            </Link>
                          </div>
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            Şifre
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              value={validation.values.password || ""}
                              type={passwordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Şifre girin"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                validation.errors.password
                                  ? true
                                  : false
                              }
                              autoComplete="current-password"
                            />
                            {validation.touched.password &&
                            validation.errors.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                              onClick={() => setPasswordShow(!passwordShow)}
                              type="button"
                              id="password-addon"
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </div>

                        <div className="form-check">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="auth-remember-check"
                          >
                            Beni Hatırla
                          </Label>
                        </div>

                        <div className="mt-4">
                          <Button
                            color="success"
                            disabled={loading}
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            {loading ? (
                              <Spinner size="sm" className="me-2" />
                            ) : null}
                            Giriş Yap
                          </Button>
                        </div>

                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title">Giriş Yapın</h5>
                          </div>
                          <div>
                            <Link
                              to="#"
                              className="btn btn-primary btn-icon me-1"
                              onClick={(e) => {
                                e.preventDefault();
                                socialResponse("facebook");
                              }}
                            >
                              <i className="ri-facebook-fill fs-16" />
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-danger btn-icon me-1"
                              onClick={(e) => {
                                e.preventDefault();
                                socialResponse("google");
                              }}
                            >
                              <i className="ri-google-fill fs-16" />
                            </Link>
                            <Button color="dark" className="btn-icon">
                              <i className="ri-github-fill fs-16"></i>
                            </Button>{" "}
                            <Button color="info" className="btn-icon">
                              <i className="ri-twitter-fill fs-16"></i>
                            </Button>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Hesabınız yok mu?{" "}
                    <Link
                      to="/register"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {" "}
                      Kayıt Ol{" "}
                    </Link>{" "}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Login;
