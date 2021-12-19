import React, { useEffect, useState } from "react";
import { makeStyles, Box, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";
import { useTable } from "react-table";

const useStyles = makeStyles((theme) => ({
  container: {
    background: "#fff",

    "& tbody > tr": {
      transition: "all 300ms ease 0s",
    },
    "& th": {
      background: theme.palette.grey[300],
      textAlign: "center",
      fontWeight: "700",
    },
  },
}));

export const ColumnTable = ({ columns, data, onRowClick, disableRowClick, options, ...props }) => {
  const classes = useStyles();

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
    defaultColumn: {
      minWidth: undefined,
      maxWidth: undefined,
      width: undefined,
      align: "center",
      disableClick: false,
    },
  });

  return (
    <Box className={classes.container} {...props}>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps()} width={column.width}>
                  {column.render("Header")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.length ? (
            rows.map((row) => {
              prepareRow(row);
              const can_row_click = onRowClick && !disableRowClick?.(row.original);

              return (
                <TableRow {...row.getRowProps()} hover={can_row_click} style={{ cursor: can_row_click && "pointer" }}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        align={cell.column.align}
                        style={cell.column.style}
                        width={cell.column.width}
                        onClick={() => !cell.column.disableClick && onRowClick?.(row.original)}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                데이터가 없습니다
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};
