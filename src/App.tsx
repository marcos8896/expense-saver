import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React, {
  useEffect,
  useState,
} from "react";
import Button from '@mui/material/Button';

import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import AddItem from './Components/AddItem/AddItem';
import { STATUSES } from './shared/statuses';
import { db } from './db/database';


export interface IExpenseData {
  id: number,
  description: string,
  amount: number,
  date: string,
}

const App = () => {
  const [rowData, setRowData] = useState<IExpenseData[]>([]);
  const [status, setStatus] = useState(STATUSES.INITIAL);
  
  const handleDeleteClick = (id: GridRowId) => () => {
    (async function() {

      try {
        // Delete from IndexedDB
        await db.Expenses.delete(id as number);
        
        // Delete from React State
        setRowData(rows => {
          return rows.filter((row) => row.id !== id); 
        });
      } catch (error) {
        console.log('Error in delete expense: ', error);
      }
    })();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'description', headerName: 'Description', editable: true },
    { field: 'amount', headerName: 'Cantidad', width: 130, editable: true },
    { field: 'date', headerName: 'Fecha', width: 200, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    }
  ];

  useEffect(() => {
    async function load() {
      const expenses = await db.Expenses.toArray();
      setRowData(expenses);
    }
    load();
  }, [])

  return (
    <div>
      <div>
        <button onClick={() => {
        console.log('rowData', rowData);
      }}>Log</button>
      </div>
      <div>
        {status === STATUSES.INITIAL && <Button
          variant="outlined"
          sx={{ my: 1 }}
          onClick={() => {
            setStatus(STATUSES.ADDING_ITEM);
          }}>Agregar artículo</Button>
        }
      </div>
      {status === STATUSES.ADDING_ITEM && <AddItem setMainData={setRowData} setStatus={setStatus}/>}
      <Paper sx={{ height: '75vh', width: '100%' }}>
        <DataGrid
          rows={rowData}
          columns={columns}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
          pageSizeOptions={[5, 25, 50]}
          sx={{ border: 0 }}
          processRowUpdate={(updatedRow) => {
            const updatedRows = rowData.map((row) =>
              row.id === updatedRow.id ? { ...row, ...updatedRow } : row
            );
            setRowData(updatedRows);
            return updatedRow;
          }}
        />
      </Paper>
    </div>
  );
};

export default App;
// TO DOS
/**
 */