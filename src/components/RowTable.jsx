import React from "react";
import { makeStyles, Box, Table, TableBody, TableRow, TableCell } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  table_wrapper: {
    width: "100%",
    background: "#fff",
    fontFamily: theme.typography.fontFamily,

    "& th": {
      width: (props) => theme.spacing(props.headWidth || 25),
      background: theme.palette.grey[300],
      fontWeight: 700,
    },
  },
}));

export const RowTable = ({ head, data = {}, headWidth, className, ...props }) => {
  const classes = useStyles({ headWidth });
  return (
    <Table className={`${classes.table_wrapper} ${className}`} {...props}>
      <TableBody>
        {head.map((row, r_idx) => (
          <TableRow key={r_idx}>
            {Array.isArray(row) ? (
              row.map((cell, c_idx) => <CellComponent data={data} cell={cell} key={c_idx} />)
            ) : (
              <CellComponent data={data} cell={{ span: 999, ...row }} />
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const CellComponent = ({ data, cell }) => {
  return (
    <>
      {// prettier-ignore
      !cell.hidden && 
      !(typeof cell.hidden === "function" && cell.hidden(data)) &&
      (
        <>
          <TableCell component="th">{typeof cell.head == "function" ? cell.head(data) : cell.head}</TableCell>
          <TableCell colSpan={cell.span || 1}>{cell.render ? cell.render(data) : data[cell.key]}</TableCell>
        </>
      )}
    </>
  );
};
