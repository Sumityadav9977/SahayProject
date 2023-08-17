import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import routes from '../../../routes';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [emailAddress, setNewemailAddress] = useState("")
  const [password, setPassword] = useState("")

 
      
  const handleClick = async () => {
    // e.preventDefault();
    const credentials = { emailAddress, password };
    
   
   const apidata = await axios.post(`http://localhost:4000/employee/login?emailAddress=${emailAddress}&password=${password}`,credentials)
  
     // console.log(apidata.data.response[0].name)

   // console.log(apidata.data.name, 'name')
   console.log("hello",apidata)
   
  

   if(apidata.data.status === 200) {
    navigate('/dashboard/app', { replace: true });
     const emailAddress = apidata.data.response[0].emailAddress;
     const name = apidata.data.response[0].name;

     sessionStorage.setItem('emailAddress',emailAddress)
     sessionStorage.setItem('name',name)
     sessionStorage.setItem('token',apidata.data.user)
    
  

   }
   else
   alert(apidata.data.response)
}
   


  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={(e) => setNewemailAddress(e.target.value)} required/>

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        onChange={(e) => setPassword(e.target.value)} required />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
