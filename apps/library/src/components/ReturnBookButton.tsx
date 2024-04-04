"use client";
import { useState } from "react";

import { returnBook } from "@/server";
import { Button } from "@mui/joy";

export function ReturnBookButton({ id }: { id: number }) {
  const [checkedOut, setCheckedOut] = useState(true);
  const handleChange = (id: number) => {
    returnBook(id);
    setCheckedOut(false);
  };
  return (
    <>
      <Button
        variant="solid"
        color="neutral"
        onClick={e => handleChange(id)}
        disabled={!checkedOut}
        className="text-slate-600 bg-slate-300 hover:bg-slate-200 "
      >
        {checkedOut ? "Return" : "Returned"}
      </Button>
    </>
  );
}
