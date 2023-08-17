import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  TextField,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// import USERLIST from '../_mock/user';
import axios from 'axios'
import Swal from 'sweetalert2'
// import { FaEye } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import Form from 'react-bootstrap/Form';
 import Modal from 'react-bootstrap/Modal';
//  import Dropzone from 'react-dropzone';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Company Name', label: 'Company Name', alignRight: false },
  { id: 'Company Number', label: 'Company Number', alignRight: false },
  { id: 'Company Email', label: 'Company Email', alignRight: false },
  // { id: 'Company Incorporation Date', label: 'Company Incorporation Date', alignRight: false },
  { id: 'emailAddress', label: 'BDE Name', alignRight: false },
  { id: 'status', label: 'status', alignRight: false },
  { id: '', label: 'Action', alignRight: false},
];

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
    return filter(array, (_user) => _user['Company Name'].toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
// -----------------------Search Function -----------------

// ------------------------End Search 

export default function UserPage() {
  
   /////////////////////////File Data Modal////////////
 const [dataModal, setDataModal] = useState(false);
 const dataCloseModal = () => {
   setDataModal(false);
 };

 const dataShowModal = () => {
   setDataModal(true);
 };


  const [fileData, setFileData] = useState([]);
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

 const [filterCompanyName, setFilterCompanyName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedUserForPopover, setSelectedUserForPopover] = useState(null);

  ////////////////////////////Assign Data///////////////////////
  const [file, setFile] = useState(null);
  const [companyCount, setCompanyCount] = useState(0);
  async function fetchUserData() {
    try {
      const response = await axios.post('http://localhost:4000/exceldata/viewalldata'); // Assuming it's a GET request
      setFileData(response.data); // Update the 'rows' state with the fetched data
      const uniqueCompanyNames = [...new Set(response.data.map((row) => row["Company Name"]))];
      setCompanyCount(uniqueCompanyNames.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
   
    fetchUserData();
  }, []);


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      await axios.post('http://localhost:4000/assigndata', formData);
      console.log('File uploaded and data assigned successfully');
      fetchUserData()
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
  ////////////////////////////Complete Data//////////////////////


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
      const newSelecteds = fileData.map((n) => n.name);
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
    setFilterCompanyName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - fileData.length) : 0;

  const filteredUsers = applySortFilter(fileData, getComparator(order, orderBy), filterCompanyName);

  const isNotFound = !filteredUsers.length && !!filterCompanyName;


 

  return (
    <>
      <Helmet>
        <title> Employees  </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            All Leads
          </Typography>
          <Typography variant="h4" gutterBottom>
            Total: {companyCount}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          
          </Typography>
          <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={dataShowModal}
            >
              Assign Data
            </Button>
        </Stack>
{/* 
         
      {/* <div>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag and drop an Excel file here</p>
          </div>
        )}
      </Dropzone>
      <button onClick={handleUpload}>Upload</button>
      <div>
        {assignedIds.map((id, index) => (
          <p key={index}>Employee {index + 1} assigned ID: {id}</p>
        ))}
      </div>
    </div> */}
    {/* <div className="file-upload-popup">
      <h2>File Upload</h2>
      <label htmlFor="fileInput" className="custom-file-input">
        Select File
        <input type="file" id="fileInput" onChange={handleFileChange} />
      </label>
      <button onClick={handleUpload}>Upload</button>
    </div>
    */}
      {/*////////File Upload /////////////////////// */}
      <Modal show={dataModal} onHide={dataCloseModal} class=" modal-xl" style={{"backgroundColor":"black"}}>
        <Modal.Body style={{"backgroundColor":"black"}}>
          <form
            class="form-container"
            enctype="multipart/form-data"
            
          >
            <div class="upload-files-container" style={{marginLeft:"-300px"}}>
              <div class="drag-file-area">
                <span class="material-icons-outlined upload-icon">
                  {" "}
                  file_upload{" "}
                </span>
                <h3 class="dynamic-message"> Drag & drop any file here </h3>
                <label class="label">
                  {" "}
                  <span class="browse-files">
                    {" "}
                    <input
                      type="file"
                      class="default-file-input"
                      onChange={handleFileChange}
                    />{" "}
                    <span class="browse-files-text">browse file</span>{" "}
                  </span>{" "}
                </label>
              </div>
              <span class="cannot-upload-message">
                {" "}
                <span class="material-icons-outlined">error</span> Please select
                a file first{" "}
                <span class="material-icons-outlined cancel-alert-button">
                  cancel
                </span>{" "}
              </span>
              <div class="file-block">
                <div class="file-info">
                  {" "}
                  <span class="material-icons-outlined file-icon">
                    description
                  </span>{" "}
                  <span class="file-name"> </span> |{" "}
                  <span class="file-size"> </span>{" "}
                </div>
                <span class="material-icons remove-file-icon">delete</span>
                <div class="progress-bar"> </div>
              </div>
              <button
                type="button"
                class="upload-button"
                onClick={() => handleUpload()}
              >
                {" "}
                Assign Data{" "}
              </button>
              <Button variant="secondary" onClick={dataCloseModal}>
                Close
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/*/////////////////////Complete File Upload///////// */}
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterCompanyName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={fileData.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, emailAddress, number, Designation, avatarUrl } = row;
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


                        <TableCell align="left">{row['Company Name']}</TableCell>

                        <TableCell align="left">{row['Company Number']}</TableCell>

                        <TableCell align="left">{row['Company Email']}</TableCell>

                        <TableCell align="left">{emailAddress}</TableCell>

                        <TableCell align="left">{row.Status}</TableCell>

                        {/* <TableCell align="left">{['']}</TableCell> */}

                        {/* <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}
          

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
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
        
        <MenuItem >
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
                            <strong>&quot;{filterCompanyName}&quot;</strong>.
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
            count={fileData.length}
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
