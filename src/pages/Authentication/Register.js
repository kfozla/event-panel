import React, { useEffect } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// action
import { apiError, resetRegisterFlag } from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

//import images
import logoLight from "../../assets/images/bocek.svg";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";
import { registerUser } from "../../api/authentication";

const Register = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      username: "",
      name: "",
      surname: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Lütfen email adresinizi girin"),
      username: Yup.string().required("Lütfen kullanıcı adınızı girin"),
      name: Yup.string().required("Lütfen isminizi girin"),
      surname: Yup.string().required("Lütfen soyisminizi girin"),
      password: Yup.string().required("Lütfen şifrenizi girin"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Şifreler eşleşmiyor")
        .required("Lütfen şifrenizi onaylayın"),
    }),

    onSubmit: async (values) => {
      const payload = {
        username: values.username,
        firstName: values.name,
        lastName: values.surname,
        email: values.email,
        password: values.password,
      };
      await registerUser(payload)
        .then((res) => {
          // Tokenları localStorage'a kaydet
          console.log("Registration successful:", res);
          localStorage.setItem("accessToken", res.accessToken);
          localStorage.setItem("refreshToken", res.refreshToken);
          toast.success(
            "Hesabınız başarıyla oluşturuldu. Giriş ekranına yönlendiriliyorsunuz..."
          );
          setTimeout(() => history("/login"), 3000);
        })
        .catch((error) => {
          console.log(error.response?.data); // Backend'in döndürdüğü hata mesajı

          toast.error(
            "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin."
          );
          dispatch(apiError(error.message));
        });
    },
  });

  const selectLayoutState = (state) => state.Account;
  const registerdatatype = createSelector(selectLayoutState, (account) => ({
    success: account.success,
    error: account.error,
  }));
  // Inside your component
  const { error, success } = useSelector(registerdatatype);

  useEffect(() => {
    dispatch(apiError(""));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setTimeout(() => history("/login"), 3000);
    }

    setTimeout(() => {
      dispatch(resetRegisterFlag());
    }, 3000);
  }, [dispatch, success, error, history]);

  document.title = "Basic SignUp | Velzon - React Admin & Dashboard Template";

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
                    Premium Admin & Dashboard Template
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Yeni hesap oluştur</h5>
                      <p className="text-muted">hesabınızı şimdi oluşturun</p>
                    </div>
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        className="needs-validation"
                        action="#"
                      >
                        {success && success ? (
                          <>
                            {toast("Your Redirect To Login Page...", {
                              position: "top-right",
                              hideProgressBar: false,
                              className: "bg-success text-white",
                              progress: undefined,
                              toastId: "",
                            })}
                            <ToastContainer autoClose={2000} limit={1} />
                            <Alert color="success">
                              Hesabınız başarıyla oluşturuldu. Giriş ekranına
                              yönlendiriliyorsunuz...
                            </Alert>
                          </>
                        ) : null}

                        {error && error ? (
                          <Alert color="danger">
                            <div>
                              Böyle bir email adresi ile kayıtlı bir hesap
                              bulunuyor. Lütfen başka bir email adresi kullanın.
                            </div>
                          </Alert>
                        ) : null}
                        {/* İsim ve Soyisim alanları yan yana */}
                        <div className="mb-3 d-flex gap-2">
                          <div style={{ flex: 1 }}>
                            <Label htmlFor="name" className="form-label">
                              İsim <span className="text-danger">*</span>
                            </Label>
                            <Input
                              name="name"
                              type="text"
                              placeholder="İsim girin"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.name || ""}
                              invalid={
                                validation.touched.name &&
                                validation.errors.name
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.name &&
                            validation.errors.name ? (
                              <FormFeedback type="invalid">
                                <div>{validation.errors.name}</div>
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div style={{ flex: 1 }}>
                            <Label htmlFor="surname" className="form-label">
                              Soyisim <span className="text-danger">*</span>
                            </Label>
                            <Input
                              name="surname"
                              type="text"
                              placeholder="Soyisim girin"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.surname || ""}
                              invalid={
                                validation.touched.surname &&
                                validation.errors.surname
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.surname &&
                            validation.errors.surname ? (
                              <FormFeedback type="invalid">
                                <div>{validation.errors.surname}</div>
                              </FormFeedback>
                            ) : null}
                          </div>
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="username" className="form-label">
                            Kullanıcı Adı <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="username"
                            type="text"
                            placeholder="Kullanıcı adı girin"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.username || ""}
                            invalid={
                              validation.touched.username &&
                              validation.errors.username
                                ? true
                                : false
                            }
                          />
                          {validation.touched.username &&
                          validation.errors.username ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.username}</div>
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="useremail" className="form-label">
                            Email <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Email girin"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.email}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="userpassword" className="form-label">
                            Şifre <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="password"
                            type="password"
                            placeholder="Şifre girin"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.password}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="form-label"
                          >
                            Şifreyi onayla{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="confirm_password"
                            type="password"
                            placeholder="Şifreyi onayla"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.confirm_password || ""}
                            invalid={
                              validation.touched.confirm_password &&
                              validation.errors.confirm_password
                                ? true
                                : false
                            }
                          />
                          {validation.touched.confirm_password &&
                          validation.errors.confirm_password ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.confirm_password}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-4">
                          <p className="mb-0 fs-12 text-muted fst-italic">
                            Kayıt olarak{" "}
                            <Link
                              to="#"
                              className="text-primary text-decoration-underline fst-normal fw-medium"
                            >
                              Kullanım Şartları'nı{" "}
                            </Link>
                            kabul etmiş olursunuz.
                          </p>
                        </div>

                        <div className="mt-4">
                          <button
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            Kayıt Ol
                          </button>
                        </div>

                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title text-muted">
                              Giriş Yapın
                            </h5>
                          </div>

                          <div>
                            <button
                              type="button"
                              className="btn btn-primary btn-icon waves-effect waves-light"
                            >
                              <i className="ri-facebook-fill fs-16"></i>
                            </button>{" "}
                            <button
                              type="button"
                              className="btn btn-danger btn-icon waves-effect waves-light"
                            >
                              <i className="ri-google-fill fs-16"></i>
                            </button>{" "}
                            <button
                              type="button"
                              className="btn btn-dark btn-icon waves-effect waves-light"
                            >
                              <i className="ri-github-fill fs-16"></i>
                            </button>{" "}
                            <button
                              type="button"
                              className="btn btn-info btn-icon waves-effect waves-light"
                            >
                              <i className="ri-twitter-fill fs-16"></i>
                            </button>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Zaten bir hesabınız var mı ?{" "}
                    <Link
                      to="/login"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {" "}
                      Giriş Yap{" "}
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

export default Register;
