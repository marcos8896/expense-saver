// src/Components/HamburgerMenu/HamburgerMenu.tsx
import { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const menuOptions = [{ id: "inicio", label: "INICIO" }];

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  return (
    <Box>
      <IconButton onClick={toggleDrawer(true)} color="inherit">
        <MenuIcon />
      </IconButton>
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
              <ListItem
                key={option.id}
                button
                component="button"
                sx={{
                  backgroundColor: "#fff",
                  "&:hover": {
                    cursor: "pointer",
                  },
                  border: "none",
                }}
              >
                <ListItemText primary={option.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default HamburgerMenu;
