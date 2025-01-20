import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './AddItem.css';
import { STATUSES } from '../../shared/statuses';

import { db } from '../../db/database';
import { getCurrentLocalSortableDate } from '../../shared/dates';
import { IExpenseData } from '../../shared/interfaces';

interface IAddItem { 
  setMainData: React.Dispatch<React.SetStateAction<IExpenseData[]>>,
  setStatus: (newStatus: string) => void
}

function AddItem({ setStatus, setMainData }: IAddItem) {
  const [newItem, setNewItem] = useState<IExpenseData>({
    id: 0,
    description: "",
    amount: 0,
    date: getCurrentLocalSortableDate()
  });

  function selectTextFromAmount() {
    const itemAmountInput = document.querySelector('#item-amount') as HTMLInputElement;
    itemAmountInput.select();
  }

  async function addItemToDB() {
    try {
      const id = await db.Expenses.add({
        description: newItem.description,
        amount: newItem.amount,
        date: newItem.date
      });

      const newItemToInsert = {...newItem, id: +id };
        setStatus(STATUSES.INITIAL);
        setMainData((prevState) => {
          return [
            ...prevState,
            newItemToInsert,
        ]
      })

    } catch (error) {
      console.log('Error in addItemToDB', error);
    }
  }

  return (
  <div className='add-item-container-inputs'>
    <TextField
      autoFocus
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
      onFocus={() => {
        selectTextFromAmount();
      }}
      sx={{ my: 1 }}/>
      
    <TextField
      id="item-date"
      label="Fecha (AAAA-MM-DD)"
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
          addItemToDB();
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