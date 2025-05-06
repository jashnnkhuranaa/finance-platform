'use client';

import React, { useState } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Trash } from "lucide-react";

function DataTable({ columns = [], data = [], onDelete, disabled, filterColumn }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  console.log("DataTable: Columns:", columns);
  console.log("DataTable: Data:", data);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const tableColumns = table.getAllColumns();
  console.log("Table Columns:", tableColumns.length ? tableColumns.map((col) => col.id) : "No columns defined");

  if (!columns.length) {
    return <p className="text-red-600 px-6 py-2">Error: No columns defined</p>;
  }

  return (
    <div className="px-6">
      <div className="flex items-center py-4">
        {filterColumn && table.getColumn(filterColumn) ? (
          <Input
            placeholder={`Search ${filterColumn}`}
            value={table.getColumn(filterColumn)?.getFilterValue() ?? ""}
            onChange={(event) => table.getColumn(filterColumn)?.setFilterValue(event.target.value)}
            className="max-w-sm mr-4"
          />
        ) : filterColumn ? (
          <p className="text-red-600">Error: {filterColumn} column not found</p>
        ) : null}
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            disabled={disabled}
            size="sm"
            variant="destructive"
            onClick={() => {
              const confirmed = window.confirm(
                `Are you sure? You are about to delete ${table.getFilteredSelectedRowModel().rows.length} item(s).`
              );
              if (confirmed) {
                onDelete(table.getFilteredSelectedRowModel().rows);
                table.resetRowSelection();
              }
            }}
          >
            <Trash className="size-4 mr-2" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </div>
  );
}

export default DataTable;