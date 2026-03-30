import React from "react";
import { NavLink } from "react-router-dom";

const Nav = () => {
  const linkClass = ({ isActive }) =>
    `rm-nav-link${isActive ? " is-active" : ""}`;

  return (
    <nav className="bg-transparent flex justify-start items-center p-3">
      <ul className="list-none flex rm-nav-list">
        <li className="mr-4">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
        </li>
        <li className="mr-4">
          <NavLink to="/search" className={linkClass}>Search</NavLink>
        </li>
        <li className="mr-4">
          <NavLink to="/about" className={linkClass}>About</NavLink>
        </li>
        <li className="mr-4">
          <NavLink to="/submit" className={linkClass}>Submit</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
