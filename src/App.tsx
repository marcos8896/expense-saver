import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
} from "ag-grid-community";
import Button from '@mui/material/Button';
import AddItem from './Components/AddItem/AddItem';
import { STATUSES } from './shared/statuses';


export interface IExpenseData {
  description: string,
  amount: number,
  date: string,
}

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
]);

const App = () => {
  const containerStyle = useMemo(() => ({ width: "100vw", height: "100vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  
  const [rowData, setRowData] = useState<IExpenseData[]>([]);
  const [status, setStatus] = useState(STATUSES.INITIAL);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "description" },
    { field: "amount" },
    { field: "date" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
      Promise.resolve([
        {
          "description": "frutería",
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
  }, []);

  return (
    <div style={containerStyle}>
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
      <div style={gridStyle}>
        <AgGridReact<IExpenseData>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default App;