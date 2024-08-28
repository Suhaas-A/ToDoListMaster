import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from '@mui/material/IconButton';
import axios from 'axios'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [usernameColor, setUsernameColor] = useState('primary');
    const [passwordColor, setPasswordColor] = useState('primary');

    const [openForgetPassword, setOpenForgetPassword] = useState(false);

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');

    const [newUsernameColor, setNewUsernameColor] = useState('primary')
    const [newPasswordColor, setNewPasswordColor] = useState('primary');
    const [newPasswordAgainColor, setNewPasswordAgainColor] = useState('primary');

    const [otp, setOtp] = useState(null);
    const [resetUsername, setResetUsername] = useState('');
    const [resetPassword, setResetPassword] = useState('');

    const [openOtp, setOpenOtp] = useState(false)
    const [readOtp, setReadOtp] = useState(null)

    async function ForgetPassword() {
        if (! newPassword === newPasswordAgain) {
            setAlert(true);
            setMessage('Both the password fields must be the same!');
            setNewPasswordColor('error');
            setNewPasswordAgainColor('error');
            console.log('error');
        } else {
            axios.post('https://ToDoListMaster.pythonanywhere.com/api/forget_password/', {
                'username': newUsername,
                'password': newPassword
            }).then((data) => {
                if (String(data.data).includes('Invalid')) {
                    setAlert(true);
                    setMessage('Invalid username');
                    setNewUsernameColor('error');
                } else {
                    setOtp(data.data['otp']);
                    setResetUsername(data.data['username']);
                    setResetPassword(data.data['password']);
                    setOpenForgetPassword(false);
                    setAlert(false);
                    setOpenOtp(true);
                    console.log(data.data);
                }
            });
        }
    }

    async function ResetPassword() {
        setOpenOtp(false);
        
        if (otp != readOtp) {
            axios.patch('https://ToDoListMaster.pythonanywhere.com/api/reset_password/' + resetUsername, {
                'password': resetPassword
            }).then((data) => {
                console.log(data.data);
            })
        } else {
            window.location.reload();
        }
    }

    async function submit() {
        if (username == '' || password == '') {
            setAlert(true);
            if (username == '') {
                setMessage('Please fill the username');
                setUsernameColor('error');
                setPasswordColor('primary');
            }
            else if (password == '') {
                setMessage('Please fill the password');
                setPasswordColor('error');
                setUsernameColor('primary');
            }
        } else {
            setUsernameColor('primary');
            setPasswordColor('primary');

            let response = await axios.post('https://ToDoListMaster.pythonanywhere.com/api/login/', {
                'username': username,
                'password': password,
            }).then((response) => {
                console.log(response.data);
                sessionStorage.setItem('accessToken', response.data['access'])
                sessionStorage.setItem('refreshToken', response.data['refresh'])
                window.location.href = '/home'
            }).catch((reason) => {
                setAlert(true);
                setMessage('Invalid username or password');
                setUsernameColor('error');
                setPasswordColor('error');
            })
        }
    }

    return (
        <>
            <Collapse in={alert}>
                <Alert severity="error" onClose={function () {setAlert(false)}}>
                    <AlertTitle>Error</AlertTitle>
                    {message}
                </Alert>
            </Collapse>

            <Box width="45%" height="60%" position="fixed" left="27%" top="19%">
                <Card elevation={6} focused style={{padding: "5%", backgroundColor: "whitesmoke"}}>
                    <Typography variant="h4" margin="2%" textAlign="center">
                        Login
                    </Typography>
                    <List>
                        <ListItem>
                            <TextField
                                focused
                                variant="outlined"
                                required
                                fullWidth
                                label="Username"
                                placeholder="Username"
                                col
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton>
                                                <AccountCircleIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                id='username'
                                color={usernameColor}
                                value={username}
                                onChange={function (e) {setUsername(e.target.value)}}
                            />
                        </ListItem>
                        <ListItem>
                            <TextField
                                focused
                                variant="outlined"
                                required
                                fullWidth
                                label="Password"
                                placeholder="Password"
                                type="password"
                                col
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton>
                                                <LockIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                color={passwordColor}
                                id="'password"
                                value={password}
                                onChange={function (e) {setPassword(e.target.value)}}
                            />
                        </ListItem>
                        <ListItem>
                            <Button variant="contained" color="primary" fullWidth onClick={submit}>
                                Login
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Typography variant="div">
                                Dont have an account : <a href="/register">Sign up</a> &nbsp;&nbsp;

                                <Button variant="contained" color="secondary" onClick={function () {setOpenForgetPassword(true)}}>Forget Password</Button>
                            </Typography>

                            <Modal
                                open={openForgetPassword}
                                onClose={function () {setOpenForgetPassword(false)}}
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
                                        label="Username"
                                        placeholder="Username"
                                        fullWidth
                                        multiline
                                        value={newUsername}
                                        onChange={function (e) {setNewUsername(e.target.value)}}
                                        autoFocus
                                        variant="outlined"
                                        required
                                        color={newUsernameColor}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <IconButton>
                                                        <AccountCircleIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        focused
                                    />

                                    <br></br><br></br>

                                    <TextField
                                        label="New Password"
                                        placeholder="New Password"
                                        type="password"
                                        fullWidth
                                        multiline
                                        value={newPassword}
                                        onChange={function (e) {setNewPassword(e.target.value)}}
                                        variant="outlined"
                                        required
                                        color={newPasswordColor}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <IconButton>
                                                        <LockIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        focused
                                        type="password"
                                    />

                                    <br></br><br></br>

                                    <TextField
                                        label="New Password Again"
                                        placeholder="New Password Again"
                                        type="password"
                                        fullWidth
                                        multiline
                                        value={newPasswordAgain}
                                        onChange={function (e) {setNewPasswordAgain(e.target.value)}}
                                        variant="outlined"
                                        required
                                        color={newPasswordAgainColor}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <IconButton>
                                                        <LockIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        focused
                                        type="password"
                                    />

                                    <br></br><br></br>

                                    <Button 
                                        variant="contained"
                                        color="primary"
                                        onClick={ForgetPassword}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Modal>

                            <Modal
                                open={openOtp}
                                onClose={function () {setOpenOtp(false)}}
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
                                        Enter OTP (Mailed)
                                    </Typography>

                                    <Divider />

                                    <br></br>

                                    <TextField
                                        label="OTP"
                                        placeholder="OTP"
                                        fullWidth
                                        value={readOtp}
                                        onChange={function (e) {setReadOtp(e.target.value)}}
                                        autoFocus
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <IconButton>
                                                        <AccountCircleIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        focused
                                    />

                                    <br></br><br></br>

                                    <Button 
                                        variant="contained"
                                        color="primary"
                                        onClick={ResetPassword}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Modal>
                        </ListItem>
                    </List>
                </Card>
            </Box>
        </>
    )
}

export default Login
