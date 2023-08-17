import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  // Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';
import axios from 'axios'
import Swal from 'sweetalert2'
// import { FaEye } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'emailAddress', label: 'Email', alignRight: false },
  { id: 'number', label: 'Number', alignRight: false },
  { id: 'Designation', label: 'Designation', alignRight: false },
  { id: '', label: 'Action', alignRight: false }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [getData, setGetData] = useState([])

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedUserForPopover, setSelectedUserForPopover] = useState(null);

  const handleOpenMenu = (event, user) => {
    setSelectedUserForPopover(user); // Set the selected user for the popover
    setOpen(event.currentTarget);
  };

 

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = getData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - getData.length) : 0;

  const filteredUsers = applySortFilter(getData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const navigate = useNavigate() 

  const handleButtonClick = (emailAddress) => {
   
    const id = emailAddress;

    // Use the navigate function to navigate to ComponentB with the ID as a parameter
    navigate(`/dashboard/profile/${id}`);
  };

    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 
    const [name, setNewname] = useState("")
    
    const [emailAddress, setNewemailAddress] = useState("")

    const [number, setNumber] = useState("")
    
    const [Designation, setDesignation] = useState("")


    async function updateData(name, emailAddress, number, Designation){
  
      
        setNewname(name);

        setNewemailAddress(emailAddress);
    
        setNumber(number);

        setDesignation(Designation);
      
      
        handleShow()
      
      }
async function saveUpdatedData(){

    let response = await axios.put(`http://localhost:4000/admin_emp/update/${emailAddress}`,{
      
      "name":name,
      "number":number,
      "Designation":Designation
      
    },
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'You have Update Successfully',
      showConfirmButton: true,
      
    }))
    
    .then(()=> {
      fetchUserData()
      setShow(false);
    })
  
       await console.log(response)
  
  }


  const [formData, setFormData] = useState({
    emailAddress: '',
    name: '',
    password: '',
    number:'',
    Designation:'',
  });
  const [showModal, setShowModal] = useState(false);

  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const addEmployee = async () => {
    try {
      await axios.post(`http://localhost:4000/admin_emp/addEmp`, formData);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'You have Add Successfully',
        showConfirmButton: true,
        
      })
      fetchUserData();
      setShowModal(false);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };




  async function fetchUserData() {
    try {
      const response = await axios.post('http://localhost:4000/admin_emp/view'); // Assuming it's a GET request
      setGetData(response.data); // Update the 'rows' state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function handleDelete(emailAddress){
 
    axios.delete(`http://localhost:4000/admin_emp/delEmployee?emailAddress=${emailAddress}`)
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'You have Deleted Successfully',
      showConfirmButton: true,
     
      
    })
         .then(() => {
          fetchUserData();
         });
   }
    
  useEffect(() => {
   
    fetchUserData();
  }, []);

 
  

  return (
    <>
    
      <Helmet>
        <title> Employees  </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Employee
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleShowModal}>
            New Employee
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={getData.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {getData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, emailAddress, number, Designation } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell> */}

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{emailAddress}</TableCell>

                        <TableCell align="left">{number}</TableCell>

                        <TableCell align="left">{Designation}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                          <Popover
                              open={Boolean(open) && selectedUserForPopover === row}
                                anchorEl={open}
                                onClose={handleCloseMenu}
                                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                PaperProps={{
                                  sx: {
                                    p: 1,
                                    width: 140,
                                    '& .MuiMenuItem-root': {
                                      px: 1,
                                      typography: 'body2',
                                      borderRadius: 0.75,
                                    },
                                  },
                                }}
                              > 
          <MenuItem onClick={()=>updateData(name, emailAddress, number, Designation)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}  onClick={()=>handleDelete(emailAddress)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
        
        <MenuItem  onClick={()=>handleButtonClick(emailAddress)}>
          <Iconify icon={'eva:eye-fill'} sx={{ mr: 2 }} />
          Profile
        </MenuItem>
      </Popover>
                        </TableCell>
        
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                      
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={getData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>


 {/*///////// Start  AddEmployee/// */}

 <Modal  show={showModal} onHide={handleCloseModal}>
        <Modal.Header >
          <Modal.Title>Add Employee Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3' controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
              />
             </Form.Group>
             <Form.Group controlId="formName" className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formpassword" className='mb-3'>
              <Form.Label>password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formcontact" className='mb-3'>
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter contact number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formDesignation" className='mb-3'>
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="Designation"
                placeholder="Enter Designation"
                name="Designation"
                value={formData.Designation}
                onChange={handleInputChange}
              />
            </Form.Group>

            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={addEmployee}>
            Add Employee
          </Button>
        </Modal.Footer>
      </Modal>
{/*/////////////AddEmployee complete //////////*/}


 {/*///////// Start  Update/// */}
 <Modal show={show} onHide={handleClose}>

<Modal.Header>

  <Modal.Title>Update Employee</Modal.Title>

</Modal.Header>

<Modal.Body>

<div>

<Form.Label>Email Address</Form.Label>

<Form.Control value={emailAddress} onChange={(e)=>setNewemailAddress(e.target.value)} disabled='true' /> <br />

<Form.Label>Name</Form.Label>

<Form.Control value={name} onChange={(e)=>setNewname(e.target.value)} /> <br />

<Form.Label>Contact number</Form.Label>

<Form.Control value={number} onChange={(e)=>setNumber(e.target.value)} /> <br />


<Form.Label>Designation</Form.Label>

<Form.Control value={Designation} onChange={(e)=>setDesignation(e.target.value)} /> <br />


</div>

</Modal.Body>

<Modal.Footer>

  <Button variant="secondary" onClick={handleClose}>

    Close

  </Button>

  <Button variant="primary" onClick={()=>saveUpdatedData()}>
  

    Save

  </Button>

</Modal.Footer>

</Modal>
{/*/////////////Update complete //////////*/}
   
  
     </>
  );
}
