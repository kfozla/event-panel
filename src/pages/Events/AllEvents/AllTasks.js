import React, { useState, useEffect, useMemo, useCallback } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";

// Import Scroll Bar - SimpleBar
import SimpleBar from "simplebar-react";

//Import Flatepicker
import Flatpickr from "react-flatpickr";

//redux
import { useSelector, useDispatch } from "react-redux";
import {
  Col,
  Modal,
  ModalBody,
  Row,
  Label,
  Input,
  Button,
  ModalHeader,
  FormFeedback,
  Form,
} from "reactstrap";

import {
  OrdersId,
  Project,
  CreateBy,
  DueDate,
  Status,
  Priority,
} from "./TaskListCol";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../Components/Common/Loader";
import { createSelector } from "reselect";
import { hover } from "@testing-library/user-event/dist/cjs/convenience/hover.js";

const AllTasks = () => {
  const [task, setTask] = useState([]);
  const [TaskList, setTaskList] = useState([]);

  // Delete Task
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setTask(null);
    } else {
      setModal(true);
      setDate(defaultdate());
    }
  }, [modal]);

  // Delete Data
  const onClickDelete = (task) => {
    setTask(task);
    setDeleteModal(true);
  };

  useEffect(() => {
    setTaskList(taskList);
  }, [taskList]);

  // Delete Data
  const handleDeleteTask = () => {
    if (task) {
      dispatch(deleteTask(task._id));
      setDeleteModal(false);
    }
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".taskCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(deleteTask(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".taskCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  const columns = useMemo(
    () => [
      {
        header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        cell: (cell) => {
          return (
            <input
              type="checkbox"
              className="taskCheckBox form-check-input"
              value={cell.getValue()}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Order ID",
        accessorKey: "taskId",
        enableColumnFilter: false,
        cell: (cell) => {
          return <OrdersId {...cell} />;
        },
      },
      {
        header: "Project",
        accessorKey: "project",
        enableColumnFilter: false,
        cell: (cell) => {
          return <Project {...cell} />;
        },
      },
      {
        header: "Tasks",
        accessorKey: "task",
        enableColumnFilter: false,
        cell: (cell) => {
          return (
            <React.Fragment>
              <div className="d-flex">
                <div className="flex-grow-1 tasks_name">{cell.getValue()}</div>
                <div className="flex-shrink-0 ms-4">
                  <ul className="list-inline tasks-list-menu mb-0">
                    <li className="list-inline-item">
                      <Link to="/apps-tasks-details">
                        <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link
                        to="#"
                        onClick={() => {
                          const taskData = cell.row.original;
                          handleCustomerClick(taskData);
                        }}
                      >
                        <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link
                        to="#"
                        className="remove-item-btn"
                        onClick={() => {
                          const taskData = cell.row.original;
                          onClickDelete(taskData);
                        }}
                      >
                        <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </React.Fragment>
          );
        },
      },
      {
        header: "Created By",
        accessorKey: "creater",
        enableColumnFilter: false,
        cell: (cell) => {
          return <CreateBy {...cell} />;
        },
      },
      {
        header: "Assigned To",
        accessorKey: "subItem",
        enableColumnFilter: false,
        cell: (cell) => {
          const assigned = cell
            .getValue()
            .map((item) => (item.img ? item.img : item));
          return (
            <React.Fragment>
              <div className="avatar-group">
                {assigned.map((item, index) => (
                  <Link key={index} to="#" className="avatar-group-item">
                    <img
                      src={
                        process.env.REACT_APP_API_URL + "/images/users/" + item
                      }
                      alt=""
                      className="rounded-circle avatar-xxs"
                    />
                    {/* process.env.REACT_APP_API_URL + "/images/users/" + */}
                  </Link>
                ))}
              </div>
            </React.Fragment>
          );
        },
      },
      {
        header: "Due Date",
        accessorKey: "dueDate",
        enableColumnFilter: false,
        cell: (cell) => {
          return <DueDate {...cell} />;
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell) => {
          return <Status {...cell} />;
        },
      },
      {
        header: "Priority",
        accessorKey: "priority",
        enableColumnFilter: false,
        cell: (cell) => {
          return <Priority {...cell} />;
        },
      },
    ],
    [handleCustomerClick, checkedAll]
  );
  const defaultdate = () => {
    let d = new Date(),
      months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    return (
      d.getDate() +
      " " +
      months[d.getMonth()] +
      ", " +
      d.getFullYear()
    ).toString();
  };

  const [date, setDate] = useState(defaultdate());

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTask}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="row">
        <Col lg={12}>
          <div className="card" id="tasksList">
            <div className="card-header border-0">
              <div className="d-flex align-items-center">
                <h5 className="card-title mb-0 flex-grow-1">
                  Etkinlikler Listesi
                </h5>
                <div className="flex-shrink-0">
                  <div className="d-flex flex-wrap gap-2">
                    <Link
                      to="/apps-events-add"
                      className="btn btn-soft-primary add-btn me-1 d-flex align-items-center text-decoration-none"
                    >
                      <i className="ri-add-line align-bottom me-1"></i> Yeni
                      Ekle
                    </Link>
                    {isMultiDeleteButton && (
                      <button
                        className="btn btn-soft-secondary"
                        onClick={() => setDeleteModalMulti(true)}
                      >
                        <i className="ri-delete-bin-2-line"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body pt-0">
              {isTaskSuccess && taskList.length ? (
                <TableContainer
                  columns={columns}
                  data={taskList || []}
                  isGlobalFilter={true}
                  isAddUserList={false}
                  customPageSize={8}
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light table-nowrap"
                  thClass="table-light text-muted"
                  handleTaskClick={handleTaskClicks}
                  isTaskListFilter={true}
                  SearchPlaceholder="Search for tasks or something..."
                />
              ) : (
                <Loader error={error} />
              )}
              <ToastContainer closeButton={false} limit={1} />
            </div>
          </div>
        </Col>
      </div>
    </React.Fragment>
  );
};

export default AllTasks;
