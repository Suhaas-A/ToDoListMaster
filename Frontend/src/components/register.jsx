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
import MailIcon from '@mui/icons-material/Mail';
import IconButton from '@mui/material/IconButton';
import axios from 'axios'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [usernameColor, setUsernameColor] = useState('primary');
    const [emailColor, setEmailColor] = useState('primary');
    const [passwordColor, setPasswordColor] = useState('primary')

    async function submit() {
        if (username == '' || password == '' || email == '') {
            setAlert(true);
            if (username == '') {
                setMessage('Please fill the username');
                setUsernameColor('error');
                setPasswordColor('primary');
                setEmailColor('primary');
            }
            else if (password == '') {
                setMessage('Please fill the password');
                setPasswordColor('error');
                setUsernameColor('primary');
                setEmailColor('primary');
            }
            else if (email == '') {
                setMessage('Please fill the email');
                setEmailColor('error');
                setUsernameColor('primary');
                setPasswordColor('primary')
            }
        } else {
            setUsernameColor('primary');
            setPasswordColor('primary');
            setEmailColor('primary');
            let response = await axios.post('http://127.0.0.1:8000/api/register/', {
                'username': username,
                'password': password,
                'email': email
            }).then((response) => {
                window.location = '/login';
            }).catch((reason) => {
                setAlert(true);
                let data = reason.response.data.username;
                if (data) {
                    setMessage('Username already exists');
                    setUsernameColor('error');
                    setEmailColor('primary');
                    setPasswordColor('primary');
                } else {
                    setMessage('Email already exists');
                    setEmailColor('error');
                    setUsernameColor('primary');
                    setPasswordColor('primary');
                }
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
                        Register
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
                            <TextField
                                focused
                                variant="outlined"
                                required
                                fullWidth
                                label="Email"
                                placeholder="Email"
                                col
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton>
                                                <MailIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                color={emailColor}
                                id='email'
                                value={email}
                                onChange={function (e) {setEmail(e.target.value)}}
                            />
                        </ListItem>
                        <ListItem>
                            <Button variant="contained" color="primary" fullWidth onClick={submit}>
                                Register
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Typography variant="a">
                                Already have an account <a href="/login">Sign in</a>
                            </Typography>
                        </ListItem>
                    </List>
                </Card>
            </Box>
        </>
    )
}

export default Register