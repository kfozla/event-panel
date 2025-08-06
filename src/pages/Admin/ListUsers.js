import React, { useEffect, useState } from "react";
import { getPanelUserAll, deletePanelUser } from "../../api/panelUser";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";

function ListUsers() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const URL = process.env.REACT_APP_API_REAL_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getPanelUserAll();
        if (response) {
          setUsers(response);
        }
      } catch (error) {
        console.error("Error fetching panel user list:", error);
      }
    };
    fetchUsers();
  }, []);

  const onClickData = (user) => {
    setUser(user);
    setDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (user) {
      try {
        await deletePanelUser(user.id);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        toast.success("Kullanıcı başarıyla silindi.");
      } catch (e) {
        toast.error("Kullanıcı silinirken bir hata oluştu.");
      }
      setDeleteModal(false);
    }
  };

  const columns = [
    {
      id: "profilePicture",
      header: "",
      accessorKey: "profilePictureUrl",
      cell: (cell) => {
        const url = cell.getValue();
        return url ? (
          <div style={{ width: 40, height: 40 }}>
            <img
              src={URL + url}
              alt="profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          </div>
        ) : (
          <div
            className="avatar-title rounded"
            style={{ width: 40, height: 40, backgroundColor: "#e0e0e0" }}
          >
            <i className="ri-user-line"></i>
          </div>
        );
      },
      enableColumnFilter: false,
    },
    {
      id: "username",
      header: "Kullanıcı Adı",
      accessorKey: "username",
      cell: (cell) => cell.getValue(),
      enableColumnFilter: false,
    },
    {
      id: "email",
      header: "E-posta",
      accessorKey: "email",
      cell: (cell) => cell.getValue(),
      enableColumnFilter: false,
    },
    {
      id: "createdOn",
      header: "Eklenme Tarihi",
      accessorKey: "createdOn",
      cell: (cell) =>
        cell.getValue()
          ? new Date(cell.getValue()).toLocaleString("tr-TR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      enableColumnFilter: false,
    },
    {
      id: "actions",
      header: "İşlemler",
      accessorKey: "id",
      cell: (cell) => {
        const user = cell.row.original;
        return (
          <div className="d-flex flex-row gap-2 justify-content-center">
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => onClickData(user)}
              title="Sil"
            >
              <i className="ri-delete-bin-line"></i>
            </button>

            <Link
              to={`/apps-user-profile/${user.id}`}
              className="btn btn-sm btn-info"
              style={{ color: "#fff" }}
              title="Görüntüle"
            >
              <i className="ri-eye-line"></i>
            </Link>
            <Link
              to={`/apps-user-events/${user.id}`}
              className="btn btn-sm btn-info"
              style={{ color: "#fff" }}
              title="Listele"
            >
              <i className="ri-list-unordered"></i>
            </Link>
          </div>
        );
      },
      enableColumnFilter: false,
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Kullanıcı Listesi" pageTitle="Kullanıcılar" />
        <Container fluid>
          <ToastContainer closeButton={false} />
          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteUser}
            onCloseClick={() => setDeleteModal(false)}
            headerText={"Kullanıcıyı Sil"}
            content={`"${
              user ? user.username : ""
            }" kullanıcısını silmek istediğinize emin misiniz ?`}
          />
          <TableContainer
            columns={columns}
            data={users || []}
            customPageSize={10}
            className="custom-header-css"
            divClass="table-responsive table-card mb-3"
            tableClass="align-middle table-nowrap mb-0"
            theadClass="table-light table-nowrap"
            thClass="table-light text-muted"
            isGlobalFilter={false}
          />
        </Container>
      </div>
    </React.Fragment>
  );
}

export default ListUsers;
