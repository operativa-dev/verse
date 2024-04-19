// import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
// import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
// import PeopleIcon from "@mui/icons-material/People";
// import ProductionQuantityLimits from "@mui/icons-material/ProductionQuantityLimits";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Sheet,
  Typography,
} from "@mui/joy";
import Link from "next/link";

export default async function SideMenu() {
  return (
    <>
      <Sheet
        className="Sidebar"
        sx={{
          position: { xs: "fixed", md: "sticky" },
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
            md: "none",
          },
          transition: "transform 0.4s, width 0.4s",
          zIndex: 1,
          height: "100dvh",
          width: "250px",
          top: 0,
          p: 2,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          className="Sidebar-overlay"
          sx={{
            position: "fixed",
            zIndex: 9998,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            opacity: "var(--SideNavigation-slideIn)",
            backgroundColor: "var(--joy-palette-background-backdrop)",
            transition: "opacity 0.4s",
            transform: {
              xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
              lg: "translateX(-100%)",
            },
          }}
        />

        <Box
          sx={{
            minHeight: 0,
            overflow: "hidden auto",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <List
            size="sm"
            sx={{
              gap: 1,
              "--List-nestedInsetStart": "30px",
            }}
          >
            <ListItem>
              <ListItemButton>
                {/* <HomeRoundedIcon /> */}
                <ListItemContent>
                  <Link href="/">
                    <Typography level="title-sm">Home</Typography>
                  </Link>
                </ListItemContent>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton>
                {/* <DashboardRoundedIcon /> */}
                <ListItemContent>
                  <Link href="/users">
                    <Typography level="title-sm"> Users</Typography>
                  </Link>
                </ListItemContent>
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton>
                {/* <PeopleIcon /> */}
                <ListItemContent>
                  <Link href="/orders">
                    <Typography level="title-sm">Orders</Typography>
                  </Link>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>
                {/* <ProductionQuantityLimits /> */}
                <ListItemContent>
                  <Link href="/products">
                    <Typography level="title-sm">Products</Typography>
                  </Link>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Sheet>
    </>
  );
}
