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

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import AddItem from './Components/AddItem/AddItem';
import { STATUSES } from './shared/statuses';


export interface IExpenseData {
  description: string,
  amount: number,
  date: string,
}

const App = () => {
  const [rowData, setRowData] = useState<IExpenseData[]>([]);
  const [status, setStatus] = useState(STATUSES.INITIAL);

  useEffect(() => {
    Promise.resolve([
      {
        "description": "Frutería",
        "amount": 10,
        "date": "2024-12-25"
      },
      {
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
          className='main-buttons'
          onClick={() => {
            setStatus(STATUSES.ADDING_ITEM);
          }}>Agregar artículo</Button>
        }
      </div>
      {status === STATUSES.ADDING_ITEM && <AddItem setMainData={setRowData} setStatus={setStatus}/>}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData.map((row) => (
              <TableRow
                key={row.description}
              >
                <TableCell component="th" scope="row">
                  {row.description}
                </TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell align="right">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default App;
// TO DOS
/**
 * 
 */