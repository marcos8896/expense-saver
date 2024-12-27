import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './AddItem.css';
import { STATUSES } from '../../shared/statuses';
import { IExpenseData } from '../../App';

interface IAddItem { 
  setMainData: React.Dispatch<React.SetStateAction<IExpenseData[]>>,
  setStatus: (newStatus: string) => void
}

function AddItem({ setStatus, setMainData }: IAddItem) {
  const [newItem, setNewItem] = useState<IExpenseData>({ description: "", amount: 0, date: "" });
  return (
  <div className='add-item-container-inputs'>
    <TextField 
      onChange={(event) => setNewItem((prevState) => {
        return { ...prevState, description: event.target.value }
      })} 
      id="item-description"
      label="Descripción"
      variant="outlined"
      value={newItem.description}
      sx={{ my: 1 }} />
      
    <TextField 
      id="item-amount"
      label="Cantidad"
      variant="outlined"
      type='number'
      onChange={(event) => setNewItem((prevState) => {
        return { ...prevState, amount: +event.target.value }
      })}
      value={newItem.amount}
      sx={{ my: 1 }}/>
      
    <TextField
      id="item-date"
      label="Fecha"
      variant="outlined"
      onChange={(event) => setNewItem((prevState) => {
        return { ...prevState, date: event.target.value }
      })}
      value={newItem.date}
      sx={{ my: 1 }}/>
    
    <div className='add-item-container-buttons'>
      <Button
        sx={{ mr: 1, mb: 1 }}
        variant="contained"
        className='main-buttons'
        disabled={newItem.description.length === 0 || newItem.date.length === 0}
        onClick={() => {
          const newItemToInsert = {...newItem};
          setStatus(STATUSES.INITIAL);
          setMainData((prevState) => {
            return [
              ...prevState,
              newItemToInsert,
            ]
          })
        }}>
          Agregar
      </Button>
      <Button
        sx={{ mb: 1 }}
        variant="outlined"
        className='main-buttons'
        onClick={() => {
          setStatus(STATUSES.INITIAL);
        }}>
          Cancelar agregado
      </Button>
    </div>
  </div>
  )
}

export default AddItem;