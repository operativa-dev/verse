import Sheet from "@mui/joy/Sheet";
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
export default async function TopMenu() {
  return (
    <>
      <Sheet
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
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
      <LocalLibraryIcon />
      {" "}Library app
      </Sheet>
    </>
  );
}
