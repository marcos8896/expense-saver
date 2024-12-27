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


export interface IExpenseData {
  id: string,
  description: string,
  amount: number,
  date: string,
}

const App = () => {
  const [rowData, setRowData] = useState<IExpenseData[]>([]);

  const [status, setStatus] = useState(STATUSES.INITIAL);
  const handleDeleteClick = (id: GridRowId) => () => {
    setRowData(rows => {
      return rows.filter((row) => row.id !== id); 
    });
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
    Promise.resolve([
      {
        "id": '2b12edbc-562a-447e-a8e2-8b180c77d106',
        "description": "Frutería",
        "amount": 10,
        "date": "2024-12-25"
      },
      {
        "id": '0c7f4650-4266-4062-b249-7da4be3c3cf3',
        "description": "Panecito",
        "amount": 11,
        "date": "2024-12-26"
      }
    ])
    .then((data: IExpenseData[]) => setRowData(data));
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
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rowData}
          columns={columns}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
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