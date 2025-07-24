import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

//Import Flatepicker
import Flatpickr from "react-flatpickr";
import { Turkish } from "flatpickr/dist/l10n/tr.js";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Dropzone from "react-dropzone";

//Import Images
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";

const CreateProject = () => {
  const SingleOptions = [
    { value: "Watches", label: "Watches" },
    { value: "Headset", label: "Headset" },
    { value: "Sweatshirt", label: "Sweatshirt" },
    { value: "20% off", label: "20% off" },
    { value: "4 star", label: "4 star" },
  ];

  const [selectedMulti, setselectedMulti] = useState(null);

  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti);
  }

  //Dropzone file upload
  const [selectedFiles, setselectedFiles] = useState([]);
  const [files, setFiles] = useState([]);

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  document.title = "Create Project | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Etkinlik Ekle" pageTitle="Etkinlikler" />
          <Row>
            <Col lg={10}>
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="project-title-input">
                      Etkinlik Başlığı
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="project-title-input"
                      placeholder="Etkinlik Başlığı Girin"
                    />
                  </div>

                  <div className="mb-3">
                    <Label
                      className="form-label"
                      htmlFor="project-thumbnail-img"
                    >
                      Kapak Resmi
                    </Label>
                    <Input
                      className="form-control"
                      id="project-thumbnail-img"
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                    />
                  </div>

                  <div className="mb-3">
                    <Label className="form-label">Etkinlik Açıklaması</Label>
                    <CKEditor
                      editor={ClassicEditor}
                      data="<p>Hello from CKEditor 5!</p>"
                      onReady={(editor) => {
                        // You can store the "editor" and use when it is needed.
                      }}
                      onChange={(editor) => {
                        editor.getData();
                      }}
                    />
                  </div>

                  <Row>
                    <Col lg={4} style={{ maxWidth: "240px" }}>
                      <div>
                        <Label
                          htmlFor="datepicker-deadline-input"
                          className="form-label"
                        >
                          Etkinlik Başlama Tarihi ve Saati
                        </Label>
                        <Flatpickr
                          className="form-control "
                          options={{
                            enableTime: true,
                            time_24hr: true,
                            dateFormat: "d M, Y H:i", // H:i = saat:dakika
                            locale: Turkish,
                          }}
                          placeholder="Etkinlik Tarihi Seçin"
                        />
                      </div>
                    </Col>
                    <Col lg={4} style={{ maxWidth: "240px" }}>
                      <div>
                        <Label
                          htmlFor="datepicker-deadline-input"
                          className="form-label"
                        >
                          Etkinlik Bitiş Tarihi ve Saati
                        </Label>
                        <Flatpickr
                          className="form-control "
                          options={{
                            enableTime: true,
                            time_24hr: true,
                            dateFormat: "d M, Y H:i", // H:i = saat:dakika
                            locale: Turkish,
                          }}
                          placeholder="Etkinlik Tarihi Seçin"
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Dosya Ekle</h5>
                </CardHeader>
                <CardBody>
                  <div>
                    <p className="text-muted">Dosyaları buraya ekleyin.</p>

                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        handleAcceptedFiles(acceptedFiles);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone dz-clickable">
                          <div
                            className="dz-message needsclick"
                            {...getRootProps()}
                          >
                            <div className="mb-3">
                              <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                            </div>
                            <h4>
                              Dosyaları buraya ekleyin veya yüklemek için
                              tıklayın.
                            </h4>
                          </div>
                        </div>
                      )}
                    </Dropzone>

                    <ul className="list-unstyled mb-0" id="dropzone-preview">
                      {selectedFiles.map((f, i) => {
                        return (
                          <Card
                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                            key={i + "-file"}
                          >
                            <div className="p-2">
                              <Row className="align-items-center">
                                <Col className="col-auto">
                                  <img
                                    data-dz-thumbnail=""
                                    height="80"
                                    className="avatar-sm rounded bg-light"
                                    alt={f.name}
                                    src={f.preview}
                                  />
                                </Col>
                                <Col>
                                  <Link
                                    to="#"
                                    className="text-muted font-weight-bold"
                                  >
                                    {f.name}
                                  </Link>
                                  <p className="mb-0">
                                    <strong>{f.formattedSize}</strong>
                                  </p>
                                </Col>
                              </Row>
                            </div>
                          </Card>
                        );
                      })}
                    </ul>
                  </div>
                </CardBody>
              </Card>

              <div className="text-end mb-4 ">
                <button
                  type="submit"
                  className="btn btn-soft-secondary w-sm me-1"
                >
                  Sil
                </button>

                <button type="submit" className="btn btn-success w-sm">
                  Ekle
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateProject;
