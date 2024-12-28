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
    { field: 'description', headerName: 'Descripción', editable: true, minWidth: 250 },
    { field: 'amount', headerName: 'Cantidad ($)', width: 100, editable: true },
    { field: 'date', headerName: 'Fecha', width: 120, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: '-',
      width: 60,
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
          autoPageSize
          sx={{ border: 0 }}
          processRowUpdate={(updatedRow: IExpenseData) => {
            (async function() {
              try {

                // update database first
                await db.Expenses.put({
                  id: updatedRow.id,
                  description:updatedRow.description,
                  date: updatedRow.date,
                  amount: updatedRow.amount
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
    </div>
  );
};

export default App;
// TO DOS
/**
 */