import { BookTypeTable } from "@/components/BookTypeTable";
import { LibraryTable } from "@/components/LibraryTable";

export default async function Library() {
  return (
    <>
      <LibraryTable />
      <br />
      <BookTypeTable />
    </>
  );
}
