import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import ShowImage from './ShowImage';
import { Link } from 'react-router-dom'; 
import Form1 from './Form1';
import Edit from './edidata';




const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const MedicalRecordsTable = ({ medicalRecords, onAddClick, onSearch, setMedicalRecords }) => {
  const [open, setOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [open1,setOpen1]=useState(false)
  const [ids,setIDs]=useState('')
  const handleOpen1=(id)=>{
    setIDs(id)
    setOpen1(true)
  }
  const handleclose1=()=>{
    setOpen1(false)
  }

  
  const handleClickOpen = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setOpen(true);
  };
  const dialogStyle = {
    overflowX: 'hidden', // Hide the horizontal scrollbar
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (id) => {
    // Add logic for handling edit action
    console.log(`Edit button clicked for entry with id: ${id}`);
  };

  const handleDelete = async (id) => {
    try {
      // Send a DELETE request to the Flask endpoint with the medical record ID
      await axios.delete(`http://localhost:5000/deleteMedicalData/${id}`);
      
      // Update the state to remove the deleted record
      setMedicalRecords(medicalRecords.filter(entry => entry._id !== id));
  
      console.log(`Medical record with id ${id} deleted successfully`);
      window.location.reload()
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '2%', marginBottom: '2%', overflowX: 'auto' }}>
      <Toolbar style={{ flexWrap: 'wrap' }}>
        <TextField
          id="search"
          label="Search"
          type="search"
          variant="outlined"
          size="small"
          style={{ width: '100%', marginBottom: '8px' }}
          onChange={(e) => onSearch(e.target.value)}
        />
        <IconButton
          type="submit"
          aria-label="search"
          style={{ '@media (max-width: 600px)': { display: 'none' } }}
        >
          <SearchIcon />
        </IconButton>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Link to="/Form1" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary" style={{ width: '100%' }}>
            Add Data
          </Button>
        </Link>
      </div>
      </Toolbar>
      <TableContainer >
        <Table style={{ tableLayout: 'auto' }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>BMI</TableCell>
              <TableCell>Disease</TableCell>
              <TableCell>Submitted Date</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicalRecords.map((entry, index) => (
              <TableRow key={entry._id} style={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>
                <TableCell>{`${entry.firstName} ${entry.lastName}`}</TableCell>
                <TableCell>{entry.email}</TableCell>
                <TableCell>{calculateAge(entry.dob)}</TableCell>
                <TableCell>{entry.phoneNumber}</TableCell>
                <TableCell>{entry.bmi}</TableCell>
                <TableCell>{entry.disease.join(' ')}</TableCell>
                <TableCell>{new Date(entry.createdAt["$date"]).toLocaleString()}</TableCell>
                
                <TableCell>
                  <React.Fragment>
                    <Button variant="outlined" onClick={() => handleClickOpen(entry.fileUrl)}>
                      SHOW IMAGE
                    </Button>
                    <BootstrapDialog
                      onClose={handleClose}
                      aria-labelledby="customized-dialog-title"
                      open={open}
                    >
                      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Modal title
                      </DialogTitle>
                      <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          color: (theme) => theme.palette.grey[500],
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" responsive>
                        <ShowImage imageUrl={selectedImageUrl} open={open} handleClose={handleClose} />
                      </Dialog>
                      <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                          Save changes
                        </Button>
                      </DialogActions>
                    </BootstrapDialog>
                  </React.Fragment>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex' }}>
                    
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpen1(entry._id['$oid'])}
                      startIcon={<EditNoteIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(entry._id['$oid'])}
                      startIcon={<DeleteIcon />}
                      style={{ marginLeft: '8px' }}
                    >
                      Delete
                    </Button>
                  </div>

                  <Dialog open={open1} onClose={handleclose1} fullWidth maxWidth="md" PaperProps={{ style: { marginTop: '-10px' } }}  style={dialogStyle}>
  <DialogContent>
    <Edit id={ids} />
  </DialogContent>
</Dialog>
                 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
     
    </Paper>
  );
};

const GetData = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  
  const [newData, setNewData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    phoneNumber: '',
    bmi: '',
    disease: '',
    fileUrl: '',
  });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getMedicalData');
        setMedicalRecords(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/searchMedicalData?term=${searchTerm}`);
      setMedicalRecords(response.data);
    } catch (error) {
      console.error('Error searching data:', error);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddData = async () => {
    try {
      const response = await axios.post('http://localhost:5000/addMedicalData', newData);
      setMedicalRecords([...medicalRecords, response.data]);
      handleCloseAddDialog();
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" style={{ flexGrow: 1, fontSize: '1.5rem','@media (max-width: 600px)': { fontSize: '1rem' } }}>
            Medical Records
          </Typography>
        </Toolbar>
      </AppBar>
      <MedicalRecordsTable
        medicalRecords={medicalRecords}
        onAddClick={handleOpenAddDialog}
        onSearch={handleSearch}
        setMedicalRecords={setMedicalRecords}
      />
    </div>
  );
};

export default GetData;
