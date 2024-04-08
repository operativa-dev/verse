"use client";
import { getProductsResults, updateProduct } from "@/server";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  Table,
  Typography,
} from "@mui/joy";
import Option from "@mui/joy/Option";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [maxResults, setMaxResults] = useState(0);
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getProductsResults(page * limit, limit, search).then(data => {
      setProducts(data.body);
      setMaxResults(data.count);
    });
  }, [page, limit, search]);
  if (products.length === 0) {
    return <div>Loading...</div>;
  }
  const getLabelDisplayedRowsTo = () => {
    if (products.length === -1) {
      return (page + 1) * limit;
    }
    return limit === -1 ? maxResults : Math.min(maxResults, (page + 1) * limit);
  };
  function labelDisplayedRows({ from, to, count }: { from: number; to: number; count: number }) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
  }
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: any, newValue: number | null) => {
    setLimit(parseInt(newValue + "", 10));
    setPage(0);
  };
  const handleSearch = (event: any) => {
    setSearch(event.target.value);
    setPage(0);
  };

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Products List</h1>
        <Link
          className="border border-slate-500 text-slate-500 px-2 py-1 rounded hover:bg-slate-200 focus-within:bg-slate-300 outline-none"
          href="/products/addProduct"
        >
          Add Product
        </Link>
      </header>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl"> </h1>
        <Button onClick={() => setEditMode(!editMode)}>Edit</Button>
      </header>
      <Input placeholder="Search..." onBlur={e => handleSearch(e)} />
      <Table aria-label="basic table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product["productId"]}>
              <td>{product["productId"]}</td>
              <td>
                <Input
                  type="text"
                  name="name"
                  disabled={editMode}
                  defaultValue={product["name"]}
                  className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                  onBlur={e => {
                    updateProduct("name", product["productId"], e.target.value);
                  }}
                />
              </td>
              <td>
                <Input
                  type="text"
                  name="description"
                  disabled={editMode}
                  defaultValue={product["description"]}
                  className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                  onBlur={e => {
                    updateProduct("description", product["productId"], e.target.value);
                  }}
                />
              </td>
              <td>
                <Input
                  type="number"
                  name="price"
                  disabled={editMode}
                  defaultValue={product["price"]}
                  className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
                  onBlur={e => {
                    updateProduct("price", product["productId"], e.target.value);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <FormControl orientation="horizontal" size="sm">
                  <FormLabel>Rows per page:</FormLabel>
                  <Select onChange={handleChangeRowsPerPage} value={limit}>
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                  </Select>
                </FormControl>
                <Typography textAlign="center" sx={{ minWidth: 80 }}>
                  {labelDisplayedRows({
                    from: products.length === 0 ? 0 : page * limit + 1,
                    to: getLabelDisplayedRowsTo(),
                    count: products.length === -1 ? -1 : maxResults,
                  })}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={page === 0}
                    onClick={() => handleChangePage(page - 1)}
                    sx={{ bgcolor: "background.surface" }}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={
                      products.length !== -1 ? page >= Math.ceil(maxResults / limit) - 1 : false
                    }
                    onClick={() => handleChangePage(page + 1)}
                    sx={{ bgcolor: "background.surface" }}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Box>
              </Box>
            </td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}
