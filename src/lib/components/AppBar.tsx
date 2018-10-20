import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";

const CustomAppBar = ({
  menuAnchorEl,
  menuIsOpen,
  onMenuIconButtonClick,
  onMenuRequestClose,
  onResetClick,
  t,
}) => (
  <AppBar>
    <Toolbar>
      <IconButton onClick={onMenuIconButtonClick} aria-label="Menu">
        <MenuIcon />
      </IconButton>
      <Menu
        id="app-bar-menu"
        anchorEl={menuAnchorEl}
        open={menuIsOpen}
        onClose={onMenuRequestClose}
      >
        <MenuItem onClick={onResetClick}>{t("appbar.reset")}</MenuItem>
      </Menu>
      <Typography variant="title" color="inherit">
        {t("appbar.title")}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default compose(
  translate("common"),
  connect(),
  withState("menuAnchorEl", "setMenuAnchorEl"),
  withState("menuIsOpen", "setMenuIsOpen", false),
  withHandlers({
    onMenuIconButtonClick: ({ setMenuIsOpen, setMenuAnchorEl }) => (e) => {
      setMenuAnchorEl(e.currentTarget);
      setMenuIsOpen(true);
    },
    onMenuRequestClose: ({ setMenuIsOpen }) => () => {
      setMenuIsOpen(false);
    },
    onResetClick: ({ setMenuIsOpen, dispatch }) => () => {
      dispatch({ type: "RESET" });
      setMenuIsOpen(false);
    },
  }),
)(CustomAppBar);
