import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// import Dropdown from 'react-bootstrap/Dropdown';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Popover,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { Dropdown, Space, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Company Name', alignRight: false },
  { id: 'Company Number', label: 'Company Number', alignRight: false },
  { id: 'Company Email', label: 'Company Email', alignRight: false },
  { id: 'State', label: 'State', alignRight: false },
  { id: 'City', label: 'City', alignRight: false },
  { id: 'Status', label: 'Status', alignRight: false },
  { id: '', label: 'Action', alignRight: false }


];
// ----------------------------------------------------------------------

const items = [
  {
    key: '1',
    type: 'group',
    label: 'Not Pickup',
  },
  {
    key: '2',
    label: 'Busy',
 
  },
  {
    key: '3',
    label: 'Switch off',
  
  },
  {
    key: '4',
    label: 'Wrong No',
  
  },
  {
    key: '5',
    label: 'Interested',
  
  },
  {
    key: '6',
    label: 'Mature',
  
  },
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

  const [statusLable, setStatusLable] = useState('');

  
  

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

  // const handleClick = (event) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
  //   }
  //   setSelected(newSelected);
  // };

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

  const handleButtonClick = (CompanyName) => {
   
    console.log(CompanyName);
    // Use the navigate function to navigate to ComponentB with the ID as a parameter
    navigate(`/dashboard/details/${CompanyName}`);
  };

  async function fetchUserData() {
    try {
          const emailAddress = sessionStorage.getItem('emailAddress');
          console.log( emailAddress);
        if(emailAddress){
          const response = await axios.post(`http://localhost:4000/exceldata/view/${emailAddress}`); // Assuming it's a GET request
          setGetData(response.data); 
          }// Update the 'rows' state with the fetched data
       } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  // const handleStatusSelect = async (statusKey) => {
  //   try {
  //     if (selectedUserForPopover) {
  //       // Find the selected item from the items array based on its key
  //       const selectedStatus = items.find((item) => item.key === statusKey);

  //       // Update the selected user's status in the local state
  //       const updatedData = getData.map((user) =>
  //         user.emailAddress === selectedUserForPopover['Company Email']
  //           ? { ...user, Status: selectedStatus.label }
  //           : user
  //       );

  //       setGetData(updatedData);

  //       // Assuming the API endpoint for saving the status is /updateStatus/:emailAddress
  //       await axios.post(`http://localhost:4000/exceldata/update/${selectedUserForPopover['Company Email']}`, {
  //         status: selectedStatus.label,
  //       });

  //       console.log('Status updated successfully:');
  //     }
  //     setOpen(null); // Close the popover
  //   } catch (error) {
  //     console.error('Error updating status:', error);
  //   }
  // };
  
  const handleChange =  async (event,CompanyName) => {
    try{
      await axios.post(`http://localhost:4000/exceldata/update`, {
        Status: event.target.value,  
       CompanyName: CompanyName
        
      });
      window.location.reload()
    }catch(error){
 alert("Satatus error")
    }
    setStatusLable(event.target.value);
    console.log(event.target.value)
    console.log("hello",CompanyName)
  };

  useEffect(() => {
   
    fetchUserData();
  }, []);

 
  

  return (
    <>
    
      <Helmet>
        <title> Employee  </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Leads
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleShowModal}>
            New Employee
          </Button> */}
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
                    const  {id} = row;
              
                       {/*  = row; */}
                    const selectedUser = selected.indexOf('Compony Name') !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, 'Company Name')} />
                        </TableCell> */}

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={'Company Name'} /> */}
                            {/* <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography> */}
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{row['Company Name']}</TableCell>

                        <TableCell align="left">{row['Company Number']}</TableCell>

                        <TableCell align="left">{row['Company Email']}</TableCell>

                        <TableCell align="left">{row.State}</TableCell>

                        <TableCell align="left">{row.City}</TableCell>

                        <TableCell align="left">
                        
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{row.Status}</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={statusLable}
                              label={row.Status}
                              onChange={(event)=>handleChange(event,row['Company Name'])}
                            >{items.map((values)=>{
                              return(
                                <MenuItem value={values.label} key={values.label}>{values.label}</MenuItem>
                              )
                            })}
                              
                              
                            </Select>
                          </FormControl>
                          </TableCell>

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
                <MenuItem >
                  <Iconify icon={'eva:eye-fill'} sx={{ mr: 2 }} onClick={()=>handleButtonClick(row['Company Name'])}/>
                  
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


  
     </>
  );
}
