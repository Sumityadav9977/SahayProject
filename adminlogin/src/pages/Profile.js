import React from "react";
import { filter } from "lodash";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { AppWidgetSummary } from "../sections/@dashboard/app";
import Modal from "react-bootstrap/Modal";
// import './App.css';
import {
  Card,
  Table,
  Stack,
  Paper,
  // Avatar,
  Grid,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Button,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from "@mui/material";
// components
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
import { useNavigate } from "react-router-dom";

import {
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
} from "mdb-react-ui-kit";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TABLE_HEAD = [
  { id: "name", label: "Sr. No", alignRight: false },
  { id: "Company_Name", label: "Company Name", alignRight: false },
  { id: "Company_Number", label: "Company Number", alignRight: false },
  {
    id: "Company Incorporation Date",
    label: "Company Incorporation Date",
    alignRight: false,
  },
  { id: "Status", label: "Status", alignRight: false },
  { id: "", label: "Action", alignRight: false },
];

export default function ProfilePage() {
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
    return order === "desc"
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
      return filter(
        array,
        (_user) => _user['Company Name'].toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const [fileData, setFileData] = useState([]);
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterCompanyName, setFilterCompanyName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedUserForPopover, setSelectedUserForPopover] = useState(null);

  const [companyCount, setCompanyCount] = useState(0);

  const handleOpenMenu = (event, user) => {
    setSelectedUserForPopover(user); // Set the selected user for the popover
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
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
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
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


  const navigate = useNavigate();
  const [getData, setGetData] = useState([]);

  const { emailAddress } = useParams();
  async function fetchExcelData() {
    try {
      const response = await axios.post(
        `http://localhost:4000/exceldata/view/${emailAddress}`
      );
      setFileData(response.data);
      const uniqueCompanyNames = [...new Set(response.data.map((row) => row["Company Name"]))];
      setCompanyCount(uniqueCompanyNames.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function fetchUser() {
    try {
      const response = await axios.post(
        `http://localhost:4000/emp/profile/${emailAddress}`
      );
      setGetData(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      // setIsLoading(false); // Error occurred, stop loading
    }
  }

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async (emailAddress) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:4000/upload/${emailAddress}`,
        {
          method: "POST",
          body: formData,
        }
      );
      fetchExcelData();
      const data = await response.text();
      // Display the response from the server
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchExcelData();
  }, [emailAddress]);
  const BackButton = () => {
    navigate(`/dashboard/user`);
  };

  /////////////////////////File Data Modal////////////
  const [dataModal, setDataModal] = useState(false);
  const dataCloseModal = () => {
    setDataModal(false);
  };

  const dataShowModal = () => {
    setDataModal(true);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          Employee Details
        </Typography>
        <Button variant="contained" marginLeft="-100px" onClick={BackButton}>
          Back
        </Button>
      </Stack>
      <section style={{ backgroundColor: "white" }}>
        <MDBContainer className="py-5">
          {getData.map((row) => {
            return (
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBRow>
                    <div style={{ width: "150px", borderRadius: "10px" }}>
                      <MDBCardImage
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                        alt="avatar"
                        className="rounded-circle"
                        style={{ width: "150px" }}
                        fluid
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="d-flex align-items-center">
                        <Typography variant="h6" component="span">
                          Name :
                        </Typography>
                        <Typography
                          variant="h6"
                          marginLeft="4px"
                          component="span"
                        >
                          {row.name}
                        </Typography>
                      </div>
                      <hr />
                      <div className="d-flex align-items-center">
                        <Typography variant="h6" component="span">
                          Email :
                        </Typography>
                        <Typography
                          variant="h6"
                          marginLeft="4px"
                          component="span"
                        >
                          {row.emailAddress}
                        </Typography>
                      </div>
                      <hr />
                      <div className="d-flex align-items-center">
                        <Typography variant="h6" component="span">
                          Contact :
                        </Typography>
                        <Typography
                          variant="h6"
                          marginLeft="4px"
                          component="span"
                        >
                          {row.number}
                        </Typography>
                      </div>
                      <hr />
                      <div className="d-flex align-items-center">
                        <Typography variant="h6" component="span">
                          Designation :
                        </Typography>
                        <Typography
                          variant="h6"
                          marginLeft="4px"
                          component="span"
                        >
                          {row.Designation}
                        </Typography>
                      </div>
                    </div>
                  </MDBRow>
                  <hr />
                </MDBCardBody>
              </MDBCard>
            );
          })}

          <Container maxWidth="xl">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Total Leads"
                  total={companyCount}
                  icon={"ant-design:android-filled"}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Interested Leads"
                  total={0}
                  color="info"
                  icon={"ant-design:apple-filled"}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Mature Leads"
                  total={0}
                  color="warning"
                  icon={"ant-design:windows-filled"}
                />
              </Grid>
            </Grid>
          </Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom></Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={dataShowModal}
            >
              Assign Data
            </Button>
          </Stack>

          <Container style={{ marginTop: "30px" }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={5}
            >
              <Typography variant="h4" gutterBottom>
                Total Leads
              </Typography>
            </Stack>

            <Card>
              <UserListToolbar
                numSelected={selected.length}
                filterName={filterCompanyName}
                onFilterName={handleFilterByName}
              />

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
                      {filteredUsers
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const {
                            id,
                            Company_Name,
                            Company_Number,
                            avatarUrl,
                          } = row;
                          const selectedUser =
                            selected.indexOf(Company_Name) !== -1;

                          return (
                            <TableRow
                              hover
                              key={id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={selectedUser}
                            >
                              {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell> */}

                              {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell> */}

                              <TableCell align="left">
                                {row["Sr. No"]}
                              </TableCell>

                              <TableCell align="left">
                                {row["Company Name"]}
                              </TableCell>

                              <TableCell align="left">
                                {row["Company Number"]}
                              </TableCell>

                              <TableCell align="left">
                                {new Date(
                                  row["Company Incorporation Date"]
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </TableCell>
                              <TableCell align="left">{row.Status}</TableCell>

                              <TableCell align="right">
                                <IconButton
                                  size="large"
                                  color="inherit"
                                  onClick={(event) =>
                                    handleOpenMenu(event, row)
                                  }
                                >
                                  <Iconify icon={"eva:more-vertical-fill"} />
                                </IconButton>
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
                                textAlign: "center",
                              }}
                            >
                              <Typography variant="h6" paragraph>
                                Not found
                              </Typography>

                              <Typography variant="body2">
                                No results found for &nbsp;
                                <strong>&quot;{filterCompanyName}&quot;</strong>.
                                <br /> Try checking for typos or using complete
                                words.
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
        </MDBContainer>
      </section>
      {/*////////File Upload /////////////////////// */}
      <Modal show={dataModal} onHide={dataCloseModal} class=" modal-xl" style={{"backgroundColor":"black"}}>
        <Modal.Body style={{"backgroundColor":"black"}}>
          <form
            class="form-container"
            enctype="multipart/form-data"
            show={dataModal}
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
                onClick={() => handleUpload(emailAddress)}
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
    </>
  );
}
