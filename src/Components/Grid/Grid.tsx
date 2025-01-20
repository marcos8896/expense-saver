import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { db } from "../../db/database";
import { IExpenseData } from "../../shared/interfaces";

function Grid(
  { rowData, columns, setRowData } :
  { rowData: IExpenseData[], columns: GridColDef[], setRowData: React.Dispatch<React.SetStateAction<IExpenseData[]>> }) {
  return <Paper sx={{ height: '75vh', width: '100%', border: '1.5px solid rgb(186, 186, 186)' }}>
  <DataGrid
    rows={rowData}
    columns={columns}
    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 25 } } }}
    autoPageSize
    pageSizeOptions={[25, 50, 100]}
    sx={{ border: 0 }}
    localeText={{ noRowsLabel: "No hay registros guardados" }}
    processRowUpdate={(updatedRow: IExpenseData) => {
      (async function() {
        try {

          // update database first
          await db.Expenses.put({
            id: updatedRow.id,
            description:updatedRow.description,
            date: updatedRow.date,
            amount: +updatedRow.amount
          });

          // update React state
          const updatedRows = rowData.map((row) =>
            row.id === updatedRow.id ? { ...row, ...updatedRow } : row
          );
          setRowData(updatedRows);
        } catch(error) {
          console.log('Error in update expense: ', error);
        }

      })()
      return updatedRow;
    }}
  />
</Paper>
}

export default Grid;