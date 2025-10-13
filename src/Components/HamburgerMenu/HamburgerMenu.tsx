import { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Box,
  Stack,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const menuOptions = [{ id: "inicio", label: "INICIO" }];

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (state: boolean) => () => setOpen(state);

  return (
    <>
      {/* Mobile: Hamburger Button */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 6px",
          margin: "0 0 15px 0",
          borderBottomRightRadius: "5px",
          borderBottomLeftRadius: "5px",
          borderBottom: "1px solid #d5d5d5",
        }}
      >
        <IconButton onClick={toggleDrawer(true)} color="inherit">
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Mobile: Drawer Menu */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            height: "100%",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            {menuOptions.map((option) => (
              <ListItem key={option.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setOpen(false); // close drawer when clicking item
                  }}
                  sx={{
                    backgroundColor: "#fff",
                    "&:hover": { cursor: "pointer" },
                    border: "none",
                  }}
                >
                  <ListItemText primary={option.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Desktop: Horizontal Menu */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: { xs: "none", md: "flex" },
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 3px 6px",
          margin: "0 0 15px 0",
          borderBottomRightRadius: "5px",
          borderBottomLeftRadius: "5px",
          borderBottom: "1px solid #d5d5d5",
        }}
      >
        {menuOptions.map((option) => (
          <Box
            key={option.id}
            component="button"
            sx={{
              background: "none",
              border: "none",
              padding: "16px 16px",
              fontSize: "1rem",
              fontWeight: 500,
              color: "#1976d2",
              cursor: "pointer",
            }}
          >
            {option.label}
          </Box>
        ))}
      </Stack>
    </>
  );
};

export default HamburgerMenu;
