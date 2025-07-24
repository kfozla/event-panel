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

import { createEvent } from "../../../api/events";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const SingleOptions = [
    { value: "Watches", label: "Watches" },
    { value: "Headset", label: "Headset" },
    { value: "Sweatshirt", label: "Sweatshirt" },
    { value: "20% off", label: "20% off" },
    { value: "4 star", label: "4 star" },
  ];
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    thumbnailUrl: "",
  });
  const navigate = useNavigate();

  // CKEditor için ayrı state
  const [editorData, setEditorData] = useState("");

  // Başlama ve bitiş tarihi için ayrı state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Kapak resmi için url
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Form submit fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();
    // eventData'yı güncelle
    const payload = {
      ...eventData,
      description: editorData,
      startTime: startDate ? startDate[0] : "",
      endTime: endDate ? endDate[0] : "",
      thumbnailUrl: thumbnailUrl,
    };
    try {
      await createEvent(payload);
      navigate("/apps-events-all"); // Yönlendirmek istediğiniz sayfanın path'i
      // Başarılı ekleme sonrası istersen yönlendirme veya mesaj ekleyebilirsin
    } catch (err) {
      // Hata yönetimi
      console.error(err);
    }
  };

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
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="project-title-input"
                      >
                        Etkinlik Başlığı
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="project-title-input"
                        placeholder="Etkinlik Başlığı Girin"
                        value={eventData.name}
                        onChange={(e) =>
                          setEventData({ ...eventData, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="project-thumbnail-img"
                      >
                        Kapak Resmi (URL)
                      </Label>
                      <Input
                        className="form-control"
                        id="project-thumbnail-img"
                        type="text"
                        placeholder="Kapak Resmi URL'si"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Etkinlik Açıklaması</Label>
                      <CKEditor
                        editor={ClassicEditor}
                        data={editorData}
                        onChange={(event, editor) => {
                          setEditorData(editor.getData());
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
                              dateFormat: "Y-m-d H:i",
                              locale: Turkish,
                            }}
                            placeholder="Etkinlik Tarihi Seçin"
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
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
                              dateFormat: "Y-m-d H:i",
                              locale: Turkish,
                            }}
                            placeholder="Etkinlik Tarihi Seçin"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <div className="text-end mb-4 ">
                  <button
                    type="button"
                    className="btn btn-soft-secondary w-sm me-1"
                  >
                    Sil
                  </button>

                  <button type="submit" className="btn btn-success w-sm">
                    Ekle
                  </button>
                </div>
              </form>
              {/* Add more sections as needed 
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
*/}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateProject;
