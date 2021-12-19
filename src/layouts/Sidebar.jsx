import React from "react";
import { NavLink, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import jwt from "jsonwebtoken";

import { makeStyles, Box, ButtonBase, Collapse, Button } from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import { Typography } from "components/Mui";

const admin_page = [
  {
    label: `회원관리`,
    path: `/member`,
    child: [
      {
        label: `일반회원`,
        path: `/customer`,
      },
      {
        label: `착한중개인`,
        path: `/dealer`,
      },
    ],
  },
  /* {
    label: `아파트 DATA`,
    path: `/house`,
  }, */
  {
    label: `게시판`,
    path: `/community`,
  },
 /*  {
    label: `아파트 이야기`,
    path: `/house_community`,
  }, */
  {
    label: `결제관리`,
    path: `/subscribe`,
  },
  {
    label: `이용약관`,
    path: `/service`,
  },
  {
    label: `개인정보 취급방침`,
    path: `/privacy`,
  },
  {
    label: `문의하기`,
    path: `/inquiry`,
  },
  {
    label: `신고내용`,
    path: `/report`,
  },
];

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "calc(100vh - 100px)",
    width: "350px",
    background: "#333",

    "& a": {
      color: "#fff",
      textDecoration: "none",
    },
  },

  parent_selected: {
    "& > *": {
      color: theme.palette.primary.main,
      background: "#fff",
    },
  },

  parent_link: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    width: "100%",
    padding: theme.spacing(3, 5),
  },
  child_link: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    width: "100%",
    padding: theme.spacing(2, 5),
    background: "#ebebeb",
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const { pathname } = useLocation();

  return (
    <Box className={classes.container}>
      {admin_page.map((item) => {
        let isCur = item.path.substring(1) === pathname.split("/")?.[1];
        return <NavComponent parent={item} isCur={isCur} key={item.label} />;
      })}
    </Box>
  );
};

const NavComponent = ({ parent, isCur }) => {
  const classes = useStyles();

  return (
    <Box borderBottom="solid 1px #222">
      <NavLink to={parent.path} activeClassName={classes.parent_selected}>
        <ButtonBase className={classes.parent_link}>
          <Typography variant="h6" fontWeight="500" display="inline">
            {parent.label}
          </Typography>
          {isCur && (
            <KeyboardArrowRight
              fontSize="large"
              style={{ color: "#222", transform: parent.child && "rotate(90deg) translateY(-10%)" }}
            />
          )}
        </ButtonBase>
      </NavLink>

      <Collapse in={isCur}>
        {parent.child?.map((child) => {
          return (
            <NavLink
              to={`${parent.path}${child.path}`}
              style={{ color: "#bababa" }}
              activeStyle={{ color: "#222" }}
              key={child.label}
            >
              <ButtonBase className={classes.child_link}>
                <Typography variant="h6" fontWeight="500" display="inline">
                  {child.label}
                </Typography>
                <KeyboardArrowRight />
              </ButtonBase>
            </NavLink>
          );
        })}
      </Collapse>
    </Box>
  );
};

export default Sidebar;
