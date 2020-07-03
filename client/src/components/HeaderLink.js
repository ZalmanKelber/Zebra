import React from "react"
import { Link } from "react-router-dom";

const HeaderLink = props => {
  return (
    <Link
        to={props.route}
    >
    {props.name}
    </Link>
  );
}

export default HeaderLink;
