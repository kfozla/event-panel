import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import { createSelector } from "reselect";

const ProfileDropdown = () => {
  const URL = "http://localhost:5176/"; // API URL
  const profiledropdownData = createSelector(
    (state) => state.Profile,
    (user) => user.user
  );
  // Inside your component
  const user = useSelector(profiledropdownData);

  const [authUser, setAuthUser] = useState({});

  useEffect(() => {
    const obj = sessionStorage.getItem("authUser");
    setAuthUser(obj ? JSON.parse(obj) : {});
  }, []);

  console.log("ProfileDropdown authUser:", authUser);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            {authUser && authUser.profilePictureUrl ? (
              <img
                className="rounded-circle header-profile-user"
                src={
                  URL +
                  authUser.profilePictureUrl +
                  "?t=" +
                  new Date().getTime()
                }
                alt="Header Avatar"
              />
            ) : (
              <div
                className="rounded-circle header-profile-user d-flex align-items-center justify-content-center bg-light"
                style={{
                  width: 40,
                  height: 40,
                  background: "#e0e0e0",
                  color: "#888",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                <i className="ri-user-line"></i>
              </div>
            )}
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {authUser.username || ""}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                {authUser.role || authUser.role_name || ""}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">
            Hoşgeldin {authUser.firstName || authUser.first_name || ""}!
          </h6>
          <DropdownItem className="p-0">
            <Link to="/profile" className="dropdown-item">
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Profil</span>
            </Link>
          </DropdownItem>

          <DropdownItem className="p-0">
            <Link to="/pages-faqs" className="dropdown-item">
              <i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle">Yardım</span>
            </Link>
          </DropdownItem>
          <div className="dropdown-divider"></div>

          <DropdownItem className="p-0">
            <Link to="/pages-profile-settings" className="dropdown-item">
              <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle">Ayarlar</span>
            </Link>
          </DropdownItem>

          <DropdownItem className="p-0">
            <Link to="/logout" className="dropdown-item">
              <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle" data-key="t-logout">
                Çıkış Yap
              </span>
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
