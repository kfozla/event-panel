import React from "react";
import {
  getServicePackages,
  getServicePackageById,
  deleteServicePackage,
  createServicePackage,
  updateServicePackage,
} from "../../api/servicePackages";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";

function ServicePackagesList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getServicePackages();
        setPackages(res || []);
      } catch (err) {
        setError("Servis paketleri alınamadı");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);
  const onClickData = (packageToDelete) => {
    setPackageToDelete(packageToDelete);
    setDeleteModal(true);
  };
  const handleDeletePackage = async () => {
    if (packageToDelete) {
      try {
        await deleteServicePackage(packageToDelete.id);
        setPackages((prev) =>
          prev.filter((pkg) => pkg.id !== packageToDelete.id)
        );
        toast.success("Servis paketi başarıyla silindi.");
      } catch (e) {
        toast.error("Servis paketi silinirken bir hata oluştu.");
      }
      setDeleteModal(false);
    }
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner /> Yükleniyor...
      </div>
    );
  if (error) return <div className="text-danger text-center my-5">{error}</div>;
  console.log("Service Packages:", packages);
  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeletePackage}
        onCloseClick={() => setDeleteModal(false)}
        headerText={"Paketi Sil"}
        content={`"${
          packageToDelete ? packageToDelete.title : ""
        }" paketini silmek istediğinize emin misiniz ?`}
      />
      <div className="page-content">
        <div className="container mt-4">
          <Row className="g-4">
            {packages.length === 0 && (
              <Col xs={12} className="text-center text-muted">
                Hiç servis paketi bulunamadı.
              </Col>
            )}
            {packages.map((pkg) => (
              <Col key={pkg.id} md={6} sm={12} xs={12}>
                <Card className="shadow border-1 " style={{ borderRadius: 16 }}>
                  <CardBody
                    className="p-4 d-flex flex-column justify-content-between"
                    style={{ minHeight: 220 }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="avatar-lg d-flex align-items-center justify-content-center bg-primary-subtle rounded-circle me-3"
                        style={{ width: 56, height: 56 }}
                      >
                        <i className="ri-global-fill text-primary fs-3"></i>
                      </div>
                      <div>
                        <div className="fw-bold fs-5 text-primary mb-1">
                          {pkg.title || "Paket Adı Bulunamadı"}
                        </div>
                      </div>
                    </div>
                    {/* Sağ üstte silme butonu */}
                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        zIndex: 2,
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <Link
                        to={`/apps-update-service-package/${pkg.id}`}
                        className="btn btn-sm btn-primary"
                        style={{ color: "#fff" }}
                        title="Düzenle"
                      >
                        <i className="ri-edit-2-line fs-6"></i>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger  border-0 shadow-none"
                        onClick={() => onClickData(pkg)}
                        title="Sil"
                      >
                        <i className="ri-delete-bin-line fs-5"></i>
                      </button>
                    </div>
                    <div className="mb-2 text-muted" style={{ minHeight: 40 }}>
                      {pkg.description || (
                        <span className="fst-italic">Açıklama yok</span>
                      )}
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      <div className="bg-light rounded px-2 py-1 small">
                        <i className="ri-calendar-2-line me-1 text-primary"></i>
                        <span className="fw-semibold">Süre:</span>{" "}
                        {pkg.activeFor || 0} Ay
                      </div>
                      <div className="bg-light rounded px-2 py-1 small">
                        <i className="ri-price-tag-3-line me-1 text-primary"></i>
                        <span className="fw-semibold">Fiyat:</span>{" "}
                        {pkg.price ? pkg.price + " ₺" : "-"}
                      </div>
                      <div className="bg-light rounded px-2 py-1 small">
                        <i className="ri-stack-line me-1 text-primary"></i>
                        <span className="fw-semibold">
                          Etkinlik Limiti:
                        </span>{" "}
                        {pkg.maxEvents || 0}
                      </div>
                      <div className="bg-light rounded px-2 py-1 small">
                        <i className="ri-user-3-line me-1 text-primary"></i>
                        <span className="fw-semibold">
                          Aktif Kullanıcı:
                        </span>{" "}
                        {pkg.panelUserCount || 0}
                      </div>
                      <div className="bg-light rounded px-2 py-1 small">
                        <i className="ri-user-3-line me-1 text-primary"></i>
                        <span className="fw-semibold">
                          Depolama Limiti:
                        </span>{" "}
                        {pkg.storageLimit + " GB" || 0}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ServicePackagesList;
