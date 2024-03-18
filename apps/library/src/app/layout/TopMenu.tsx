import Sheet from "@mui/joy/Sheet";

export default async function TopMenu() {
  return (
    <>
      <Sheet
        sx={{
          // display: { xs: "flex", md: "none" },
          alignItems: "center",
          justifyContent: "space-between",
          // position: "fixed",
          top: 0,
          width: "100vw",
          height: "var(--Header-height)",
          zIndex: 9995,
          p: 2,
          gap: 1,
          borderBottom: "1px solid",
          borderColor: "background.level1",
          boxShadow: "sm",
        }}
      >
        {/* <MenuIcon /> */}
        Library app
      </Sheet>
    </>
  );
}
