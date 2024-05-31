import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from '@mui/material/Divider';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { format } from 'date-fns';
import { MenuItem } from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Checkbox from '@mui/material/Checkbox';

function Home() {
    const [tasks, setTasks] = useState([]);
    const [read, setRead] = useState(false);

    const [expanded, setExpanded] = useState({});

    const [update, setUpdate] = useState(false);

    const [taskName, setTaskName] = useState('');
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editId, setEditId] = useState('');

    const [dueDate, setDueDate] = useState(new Date());
    const [openDateModal, setOpenDateModal] = useState(false);
    const [dateId, setDateId] = useState('');

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [name, setName] = useState('');
    const [date, setDate] = useState(null);

    const [sort, setSort] = useState([null]);
    const [openSort, setOpenSort] = useState(false);
    const [tempSort, setTempSort] = useState(sort);

    const [filter, setFilter] = useState({
        'name': [null],
        'fulfilled': null, 
        'createDate': null, 
        'rangeStartCreateDate': null, 
        'rangeEndCreateDate': null, 
        'dueDate': null, 
        'rangeStartDueDate': null, 
        'rangeEndDueDate': null,
        'completionDate': null, 
        'rangeStartCompletionDate': null, 
        'rangeEndCompletionDate': null
    });
    const [openFilter, setOpenFilter] = useState(false);
    const [tempFilter, setTempFilter] = useState(filter);
    const [filterUpdate, setFilterUpdate] = useState(false);

    async function changeAccessToken() {
        try {
            let response = await axios.post('http://127.0.0.1:8000/api/login/refresh/', {
                'refresh': `${sessionStorage.refreshToken}`
            });

            let data = await response.data

            sessionStorage.setItem('accessToken', data['access']);

            window.location.reload();
        } catch (error) {
            window.location.href = '/login';
            console.log(error);
        }
    }

    async function fetchMyTasks() {
        try {
            let response = await axios.get('http://127.0.0.1:8000/api/create_list_task/', {
                headers: {
                    Authorization: `Bearer ${sessionStorage.accessToken}`,
                    Sort: sort,
                    Filter: JSON.stringify(filter)
                }
            });

            return await response.data;
        } catch (error) {
            changeAccessToken();
        }
    }

    async function deleteTask(task_id) {
        try {
            let response = await axios.delete('http://127.0.0.1:8000/api/view_update_delete/' + Number(task_id) + '/', {
                headers: {
                    Authorization: `Bearer ${sessionStorage.accessToken}`
                }
            });

            console.log(await response.data);

            window.location.reload();
        } catch (error) {
            changeAccessToken();
        }
    }

    async function editTask() {
        try {
            let response = await axios.patch('http://127.0.0.1:8000/api/view_update_delete/' + Number(editId) + '/', {'name' : taskName}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.accessToken}`
                }
            });

            console.log(await response.data);

            window.location.reload();
        } catch (error) {
            changeAccessToken();
        }
    }

    async function markAsCompleted(taskId) {
        try {
            let date = format(new Date(), 'yyyy-MM-dd')

            let response = await axios.patch('http://127.0.0.1:8000/api/view_update_delete/' + Number(taskId) + '/', {'fulfilled' : true, 'completion_date': date}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.accessToken}`
                }
            });

            console.log(await response.data);

            window.location.reload();
        } catch (error) {
            changeAccessToken();
        }
    }

    async function editDueDate() {
        try {
            console.log(format(new Date(dueDate), 'yyyy-MM-dd'));

            let response = await axios.patch('http://127.0.0.1:8000/api/view_update_delete/' + Number(dateId) + '/', {'due_date' : format(new Date(dueDate), 'yyyy-MM-dd')}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.accessToken}`
                }
            });

            console.log(await response.data);

            window.location.reload();
        } catch (error) {
            changeAccessToken();
        }
    }

    async function markAsInComplete(taskId) {
        try {
            let response = await axios.patch('http://127.0.0.1:8000/api/view_update_delete/' + Number(taskId) + '/', {'fulfilled': false, 'completion_date': null}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.accessToken}`
                }
            });

            console.log(await response.data);

            window.location.reload();
        } catch (error) {
            changeAccessToken();
        }
    }

    async function createTask() {
        try {
            let response = await axios.post('http://127.0.0.1:8000/api/create_list_task/', {'name': name, 'due_date': format(new Date(date), 'yyyy-MM-dd')}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.accessToken}`
                }
            });

            console.log(await response.data);

            window.location.reload();
        } catch (error) {
            //changeAccessToken();
            console.log(error);
        }
    }

    async function handleSort(e) {
        let {
            target: { value },
        } = e;

        value = value.slice(value.indexOf(null) + 1, value.length);

        setTempSort(
            typeof value === 'string' ? value.split(',') : value,
        );

        console.log(e.target.value);
    }

    async function handleFilter(e, field) {
        let {
            target: { value },
        } = e;

        value = value.slice(value.indexOf(null) + 1, value.length);

        tempFilter[field] = typeof value === 'string' ? value.split(',') : value;

        setUpdate(!update);

        console.log(tempFilter);
    }

    useEffect(() => {
        console.log('hi');
        console.log(`filter: ${filter}`);
        fetchMyTasks().then((data) => {
            console.table(data);

            data.map((task) => {
                expanded[task['name']] = false;
            })
            console.log(expanded);

            setTasks(data);
            setRead(true);
        })
    }, [sort, filterUpdate])
    
    return (
        <>
            <Card sx={{position: "sticky", top: "0%", zIndex: 3, backgroundColor: 'lightyellow'}}>
                <CardContent>
                    <Button variant="contained" color='primary' onClick={function() {setOpenCreateModal(true)}}>Create Task</Button> &nbsp;&nbsp;&nbsp;

                    <Button startIcon={<SortIcon />} variant="contained" color="primary" onClick={function () {setOpenSort(true)}}>Sort</Button> &nbsp;&nbsp;&nbsp;
                    <Dialog disableEscapeKeyDown open={openSort} onClose={function () {setOpenSort(false)}}>
                        <DialogTitle>Sort Dialog Box</DialogTitle>

                        <DialogContent>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <Select
                                    variant="filled"
                                    label="Sort"
                                    value={tempSort}
                                    onChange={function (e) {handleSort(e)}}
                                    multiple
                                    fullwidth
                                >
                                    <MenuItem value={null}>None</MenuItem>
                                    <MenuItem value={"name"}>Name (Asc)</MenuItem>
                                    <MenuItem value={"create_date"}>Create Date (Asc)</MenuItem>
                                    <MenuItem value={"due_date"}>Due Date (ASC)</MenuItem>
                                    <MenuItem value={"fulfilled"}>Fulfilled (ASC)</MenuItem>
                                    <MenuItem value={"completion_date"}>Completion Date (ASC)</MenuItem>
                                    <MenuItem value={"-name"}>Name (Desc)</MenuItem>
                                    <MenuItem value={"-create_date"}>Create Date (Desc)</MenuItem>
                                    <MenuItem value={"-due_date"}>Due Date (Desc)</MenuItem>
                                    <MenuItem value={"-fulfilled"}>Fulfilled (Desc)</MenuItem>
                                    <MenuItem value={"-completion_date"}>Completion Date (Desc)</MenuItem>
                                </Select>
                            </Box>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={function () {setOpenSort(false)}}>Cancel</Button>
                            <Button onClick={function () {setOpenSort(false) ; setSort(tempSort)}}>Ok</Button>
                        </DialogActions>
                    </Dialog>

                    <Button startIcon={<FilterAltIcon />} variant="contained" color="primary" onClick={function () {setOpenFilter(true)}}>Filter</Button>
                    <Dialog disableEscapeKeyDown open={openFilter} onClose={function () {setOpenFilter(false)}}>
                        <DialogTitle>Filter Dialog Box</DialogTitle>

                        <DialogContent>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <Select
                                    variant="filled"
                                    label="Sort"
                                    value={tempFilter['name']}
                                    onChange={function (e) {handleFilter(e, 'name')}}
                                    multiple
                                    fullwidth
                                >
                                    <MenuItem key={null} value={null}>None</MenuItem>
                                    {
                                        tasks.map((task, index) => (
                                            <MenuItem key={index}value={task['name']}>{task['name']}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </Box>

                            <br></br>

                            <Divider />

                            <br></br>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <Select
                                    variant="filled"
                                    label="Sort"
                                    value={tempFilter['fulfilled']}
                                    onChange={function (e) {tempFilter['fulfilled'] = e.target.value ; setUpdate(!update)}}
                                    fullwidth
                                >
                                    <MenuItem value={null}>None</MenuItem>
                                    <MenuItem value={true}>True</MenuItem>
                                    <MenuItem value={false}>False</MenuItem>
                                </Select>
                            </Box>

                            <br></br>

                            <Divider />

                            <br></br>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'DatePicker',
                                        ]}
                                    >
                                        <DemoItem>
                                            <DatePicker
                                                label="Create Date Equals To"
                                                value={tempFilter['createDate']}
                                                onChange={(newValue) => {tempFilter['createDate'] = newValue ; setUpdate(!update) ; console.log(tempFilter['createDate'])}}
                                                disableFuture
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'DatePicker',
                                        ]}
                                    >
                                        <DemoItem>
                                            <DatePicker
                                                label="Create Date Start Range"
                                                value={tempFilter['rangeStartCreateDate']}
                                                onChange={(newValue) => {tempFilter['rangeStartCreateDate'] = newValue ; setUpdate(!update) ; console.log(tempFilter['rangeStartCreateDate'])}}
                                                disableFuture
                                            />
                                        </DemoItem>

                                        <DemoItem>
                                            <DatePicker
                                                label="Create Date End Range"
                                                value={tempFilter['rangeEndCreateDate']}
                                                onChange={(newValue) => {tempFilter['rangeEndCreateDate'] = newValue ; setUpdate(!update) ; console.log(tempFilter['rangeEndCreateDate'])}}
                                                minDate={tempFilter['rangeStartCreateDate']}
                                                disableFuture
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>

                            <br></br>

                            <Divider />

                            <br></br>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'DatePicker',
                                        ]}
                                    >
                                        <DemoItem>
                                            <DatePicker
                                                label="Due Date Equals To"
                                                value={tempFilter['dueDate']}
                                                onChange={(newValue) => {tempFilter['dueDate'] = newValue ; setUpdate(!update) ; console.log(tempFilter['dueDate'])}}
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'DatePicker',
                                        ]}
                                    >
                                        <DemoItem>
                                            <DatePicker
                                                label="Due Date Start Range"
                                                value={tempFilter['rangeStartDueDate']}
                                                onChange={(newValue) => {tempFilter['rangeStartDueDate'] = newValue ; setUpdate(!update) ; console.log(tempFilter['rangeStartDueDate'])}}
                                            />
                                        </DemoItem>

                                        <DemoItem>
                                            <DatePicker
                                                label="Due Date End Range"
                                                value={tempFilter['rangeEndDueDate']}
                                                onChange={(newValue) => {tempFilter['rangeEndDueDate'] = newValue ; setUpdate(!update) ; console.log(tempFilter['rangeEndDueDate'])}}
                                                minDate={tempFilter['rangeStartDueDate']}
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>
                            
                            <br></br>

                            <Divider />

                            <br></br>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'DatePicker',
                                        ]}
                                    >
                                        <DemoItem>
                                            <DatePicker
                                                label="Completion Date Equals To"
                                                value={tempFilter['completionDate']}
                                                onChange={(newValue) => {tempFilter['completionDate'] = newValue ; setUpdate(!update) ; console.log(tempFilter['completionDate'])}}
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'DatePicker',
                                        ]}
                                    >
                                        <DemoItem>
                                            <DatePicker
                                                label="Completion Date Start Range"
                                                value={tempFilter['rangeStartCompletionDate']}
                                                onChange={(newValue) => {tempFilter['rangeStartCompletionDate'] = newValue ; setUpdate(!update) ; console.log(tempFilter['rangeStartCompletionDate'])}}
                                            />
                                        </DemoItem>

                                        <DemoItem>
                                            <DatePicker
                                                label="Completion Date End Range"
                                                value={tempFilter['rangeEndCompletionDate']}
                                                onChange={(newValue) => {tempFilter['rangeEndCompletionDate'] = newValue ; setUpdate(!update) ; console.log(tempFilter['rangeEndCompletionDate'])}}
                                                minDate={tempFilter['rangeStartCompletionDate']}
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={function () {setOpenFilter(false)}}>Cancel</Button>
                            <Button onClick={
                                function () {
                                    setOpenFilter(false);
                                    setFilter(tempFilter);
                                    setFilterUpdate(!filterUpdate)
                                }
                            }>Ok</Button>
                        </DialogActions>
                    </Dialog>

                </CardContent>
            </Card>

            <Modal
                open={openCreateModal}
                onClose={function() {setOpenCreateModal(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box 
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h4" component="div">
                        Extend Due Date
                    </Typography>

                    <Divider />

                    <br></br>

                    <TextField
                        label="Task Name"
                        placeholder="Task Name"
                        fullWidth
                        multiline
                        value={name}
                        onChange={function(e) {setName(e.target.value)}}
                    />

                    <br></br>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                            components={[
                                'DatePicker',
                            ]}
                        >
                            <DemoItem>
                                <DatePicker
                                    disablePast
                                    label="Due Date"
                                    placeholder="Due Date"
                                    value={date}
                                    onChange={(value) => setDate(value)}
                                />
                            </DemoItem>
                        </DemoContainer>
                    </LocalizationProvider>

                    <br></br>

                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={createTask}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>

            <br></br><br></br>

            {
                read ?
                    <List 
                        sx={{
                            overflow: "auto"
                        }}
                    >                        
                        {
                            tasks.map((task, index) => (
                                task['fulfilled'] ?
                                    <ListItem key={index}>
                                        <Card elevation={6} sx={{width: "100%"}}>
                                            <Chip label='Task Successfully, Completed!' color="success"/>

                                            <CardHeader
                                                title={task['name']}
                                            />

                                            <Divider component="li" />

                                            <CardActions>
                                                <IconButton
                                                    onClick={function () {expanded[task['name']] = !expanded[task['name']]; console.log(expanded); setUpdate(!update);}}
                                                >
                                                    <ExpandMoreIcon />
                                                </IconButton>

                                                <Button color="error" variant="contained" onClick={function () {markAsInComplete(task['id'])}}>Mark as InComplete</Button>
                                            </CardActions>

                                            <Collapse in={expanded[task['name']]} timeout="auto" unmountOnExit>
                                                <Divider component="li" />
                                                <CardContent>
                                                    <Typography variant="h6">
                                                        Create Date : <b>{task['create_date']}</b>
                                                        <br></br>
                                                        Due Date : <b>{task['due_date']}</b>
                                                        <br></br>
                                                        {
                                                            Math.ceil((new Date(task['completion_date']) - new Date()) / (1000 * 60 * 60 * 24)) == 0 ?
                                                                <>
                                                                    Status : <b>Completed Today</b>
                                                                </>
                                                            :
                                                                <>
                                                                    Status : <b>Completed {Math.abs(Math.ceil((new Date(task['completion_date']) - new Date()) / (1000 * 60 * 60 * 24))) == 1 ? <>{1} Day Ago</> : <>{Math.abs(Math.ceil((new Date(task['completion_date']) - new Date()) / (1000 * 60 * 60 * 24)))} Days Ago</>}</b>
                                                                </>
                                                        }
                                                    </Typography>
                                                </CardContent>
                                            </Collapse>
                                        </Card>
                                    </ListItem>
                                :
                                    <ListItem key={index}>
                                        <Card elevation={6} sx={{width: "100%"}}>
                                            {
                                                Math.ceil((new Date(task['due_date']) - new Date()) / (1000 * 60 * 60 * 24)) + 1 > 0 ?
                                                    <Chip label='Status Pending' color="warning"/>
                                                :
                                                    <Chip label='Status Incomplete, Task Failed!' color="error"/>
                                            }

                                            <CardHeader
                                                title={task['name']}
                                            />

                                            {
                                                Math.ceil((new Date(task['due_date']) - new Date()) / (1000 * 60 * 60 * 24)) + 1 > 0 ?
                                                    <>
                                                        <Divider component="li" />

                                                        <CardActions>
                                                            <IconButton
                                                                onClick={function () {expanded[task['name']] = !expanded[task['name']]; console.log(expanded); setUpdate(!update);}}
                                                            >
                                                                <ExpandMoreIcon />
                                                            </IconButton>

                                                            <Button color="success" variant="contained" onClick={function () {markAsCompleted(task['id'])}}>Mark as Completed</Button>

                                                            <Button color="error" variant="contained" onClick={function () {deleteTask(task['id'])}}>Delete</Button>

                                                            <Button color="primary" variant="contained" onClick={function () {setOpenEditModal(true) ; setTaskName(task['name']) ; setEditId(task['id'])}}>Edit</Button>

                                                            <Button color="secondary" variant="contained" onClick={function () {setOpenDateModal(true) ; setDueDate(dayjs(task['due_date'])) ; setDateId(task['id'])}}>Extend Due Date</Button>
                                                        </CardActions>

                                                        <Collapse in={expanded[task['name']]} timeout="auto" unmountOnExit>
                                                            <Divider component="li" />
                                                            <CardContent>
                                                                <Typography variant="h6">
                                                                    Create Date : <b>{task['create_date']}</b>
                                                                    <br></br>
                                                                    Due Date : <b>{task['due_date']}</b>
                                                                    <br></br>
                                                                    Days Left : <b>{Math.ceil((new Date(task['due_date']) - new Date()) / (1000 * 60 * 60 * 24)) + 1}</b>
                                                                </Typography>
                                                            </CardContent>
                                                        </Collapse>
                                                    </>
                                                :
                                                    null
                                            }
                                        </Card>
                                    </ListItem>
                            ))
                        }
                    </List>
                :
                    <CircularProgress />
            }

            <Modal
                open={openEditModal}
                onClose={function () {setOpenEditModal(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box 
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h4" component="div">
                        Edit The Task
                    </Typography>

                    <Divider />

                    <br></br>

                    <TextField
                        label="Task Name"
                        placeholder="Task Name"
                        fullWidth
                        multiline
                        value={taskName}
                        onChange={function (e) {setTaskName(e.target.value)}}
                        autoFocus
                    />

                    <br></br><br></br>

                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={editTask}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>

            <Modal
                open={openDateModal}
                onClose={function () {setOpenDateModal(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box 
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h4" component="div">
                        Extend Due Date
                    </Typography>

                    <Divider />

                    <br></br>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                            components={[
                                'DatePicker',
                            ]}
                        >
                            <DemoItem>
                                <DatePicker
                                    disablePast
                                    value={dueDate}
                                    onChange={(newDate) => setDueDate(newDate)}
                                />
                            </DemoItem>
                        </DemoContainer>
                    </LocalizationProvider>

                    <br></br>

                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={editDueDate}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>
        </>
    )
}

export default Home