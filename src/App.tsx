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
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import AddItem from './Components/AddItem/AddItem';
import { STATUSES } from './shared/statuses';
import { db } from './db/database';
import ClipboardJS from 'clipboard';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export interface IExpenseData {
  id: number,
  description: string,
  amount: number,
  date: string,
}

const App = () => {
  const [rowData, setRowData] = useState<IExpenseData[]>([]);
  const [status, setStatus] = useState(STATUSES.INITIAL);
  const [textareaExportClipboard, setTextareaExportClipboard] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  
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

  function handleExportToClipboardForSheet() {
    async function load() {
      try {
        const expenses = await db.Expenses.toArray();
        let strings: string[] = [];
        expenses.forEach(expense => {
          strings.push(`${expense.description}	$${expense.amount}	${expense.date}`)
        })
        const result = strings.join('\n');
        setTextareaExportClipboard(result);
        setStatus(STATUSES.COPY_TO_CLIPBOARD);
      } catch (error) {
        console.log('handleExportToClipboardForSheet error: ', error)
      }
    }
    load();
  }

  function copyToClipboard() {
    const clipboard = new ClipboardJS('#button-export-clipboard');

    clipboard.on('success', function() {
      clipboard.destroy();
      setStatus(STATUSES.INITIAL);
    });
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'description', headerName: 'Descripción', editable: true, minWidth: 250 },
    { field: 'amount', headerName: 'Cantidad ($)', minWidth: 170, editable: true },
    { field: 'date', headerName: 'Fecha', minWidth: 150, editable: true },
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
      <Box sx={{ 
        border: '1px solid rgb(186, 186, 186)', padding: '10px', borderRadius: '10px', mb: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
       <Box>
        {status === STATUSES.INITIAL && <Button
            variant="outlined"
            sx={{ m: 1 }}
            onClick={() => {
              setStatus(STATUSES.ADDING_ITEM);
            }}>Agregar artículo</Button>
          }
          {status === STATUSES.INITIAL && <Button
            variant="outlined"
            sx={{ m: 1 }}
            onClick={() => {
              handleExportToClipboardForSheet()
            }}>Exportar a portapapeles</Button>
          }
          
          {status === STATUSES.COPY_TO_CLIPBOARD && <Button
            variant="outlined"
            sx={{ m: 1 }}
            onClick={() => {
              setStatus(STATUSES.INITIAL);
            }}>Cancelar</Button>
          }

          {status === STATUSES.COPY_TO_CLIPBOARD && <Button
            variant="outlined"
            id="button-export-clipboard"
            data-clipboard-target="#textarea-export-clipboard"
            sx={{ m: 1 }}
            onClick={() => {
              copyToClipboard();
              setSnackbarOpen(true);
            }}>Copiar</Button>
          }
          {status === STATUSES.COPY_TO_CLIPBOARD &&
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" component="p">
              Copy to clipboard in Google Sheet format
            </Typography>
            <textarea id="textarea-export-clipboard" style={{ transform: "scale(0)" }} readOnly value={textareaExportClipboard}></textarea>
          </Box> 
          }
       </Box>
      </Box>
      {status === STATUSES.ADDING_ITEM && <AddItem setMainData={setRowData} setStatus={setStatus}/>}
      
      <Paper sx={{ height: '75vh', width: '100%' }}>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={(
          _: React.SyntheticEvent | Event,
          reason?: SnackbarCloseReason,
        ) => {
          if (reason === 'clickaway') {
            return;
          };

          setSnackbarOpen(false);
        }}
        message="Copiado a portapapeles"
      />
    </div>
  );
};

export default App;
// TO DOS
/**
 */