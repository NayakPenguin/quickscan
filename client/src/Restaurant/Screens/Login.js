import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { jwtDecode } from "jwt-decode";

import CallMadeIcon from '@material-ui/icons/CallMade';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import PersonIcon from '@material-ui/icons/Person';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import axios from 'axios'
import {updateRestaurant} from '../../userslice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [isOwner, setIsOwner] = useState(false);
    const [restaurantid,setRestaurantId] = useState("")
    const [accesskey , setAccesskey] = useState("")
    const restaurant = useSelector(state => state.restaurant)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    useEffect(() => {
        const jwt = localStorage.getItem('authToken')
        console.log(jwt)
        if(jwt) {
            const decodedHeader = jwtDecode(jwt);

            console.log(decodedHeader)
        }
    },[])

    const handleLogin = async ()=>{
        try {
            const response = await axios.post('http://localhost:8000/login', {
                restaurant_id:restaurantid ,
                access : accesskey
            });
      
            // Handle the response, e.g., set state or perform additional actions
            console.log('Login successful:', response.data);
            if(!response.data.token){
                alert("Invalid credentials")
                return 
                //fixed the login issue with this logic
            }
            localStorage.setItem('authToken',response.data.token)
            dispatch(updateRestaurant({id:restaurantid,accesskey:accesskey}))
            navigate('/show')
          } catch (error) {
            // Handle errors, e.g., display an error message
            console.error('Login failed:', error.message);
          }
    }
    return (
        <Container>
            <Navbar >
                <div className="left">
                    <img src="https://live.staticflickr.com/65535/49816898282_e611b8f730_b.jpg" alt="" />
                </div>
                <div className="right">
                    <a href="/" className="normal-link">
                        Don't have an account? 
                        <b>Talk with Sales</b> <ArrowForwardIcon/>
                    </a>
                </div>
            </Navbar>
            <Form>
                <h3>Login to your Restaurant Dashboard</h3>
                <div className="input-container">
                    <div className="svg-container">
                        <PersonIcon/>
                    </div>
                    <div className="result">{
                        isOwner ? "Restaurant Owner" : "Restaurant Manager"
                    }</div>
                    <div className="swap-icon" onClick={() => setIsOwner(!isOwner)}><SwapHorizIcon/></div>
                </div>
                <div className="input-container">
                    <div className="svg-container">
                        <RestaurantIcon/>
                    </div>
                    <input type="text" placeholder="Registered Restaurant ID" onChange={(e) => setRestaurantId(e.target.value)} />
                </div>
                <div className="input-container">
                    <div className="svg-container">
                        <VpnKeyIcon/>
                    </div>
                    <input type="text" placeholder="Access Key" onChange={(e) => setAccesskey(e.target.value)}/>
                </div>
                <a href="/" className="two-fact-auth-req-link">Request 2FA to enhance security measures.</a>
                <div className="login-btn" onClick={() => handleLogin()}>
                    Login
                </div>
            </Form>
            <div className="bottom">
            If you need to update your access key or enable 2FA, please get in touch with the <a href="/">technical team</a>.
            </div>
        </Container>
    )
}

export default Login

const Container = styled.div`
    padding: 50px 12.5%;
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .bottom{
        max-width: 350px;
        text-align: center;
        font-size: 0.75rem;
        font-weight: 200;

        a{
            font-weight: 500;
        }
    }
`

const Navbar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* border-bottom: 1px solid black; */

  .left{
    display: flex;
    align-items: center;
    
    img{
      height: 60px;
    }
  }

  .right{
    display: flex;
    align-items: center;
    
    .normal-link{
        color: #333;
        font-size: 0.85rem;
        margin: 0 10px;
        text-decoration: none;
    
        font-weight: 300;
        display: flex;
        align-items: center;
        
        b{
            font-weight: 500;
            font-size: 1rem;
            margin-left: 5px;
        }

        svg{
            font-size: 1.25rem;
            margin-left: 5px;
        }
    }
  }
`


const Form = styled.div`
    width: 500px;
    /* background-color: orange; */

    display: flex;
    flex-direction: column;
    align-items: center;

    h3{
        font-weight: 500;
        margin-bottom: 20px;
    }

    .input-container{
        background-color: orange;
        position: relative;

        background: #edf2f7;
        height: 48px;
        font-size: 16px;
        
        display: flex;
        align-items: center;
        border-radius: 10px;
        border: 1px solid #e4e3e3;
        margin-bottom: 10px;

        .svg-container{
            height: 48px;
            width: 48px;
            display: grid;
            place-items: center;
            border-right: 1px solid #e4e3e3;

            svg{
                font-size: 1.25rem;
            }
        }

        input{
            height: 48px;
            font-size: 0.85rem;
            width: 300px;
            padding: 0 10px;
            background-color: transparent;
            border: none;
            font-weight: 300;
        }

        .result{
            height: 48px;
            font-size: 0.85rem;
            width: 300px;
            padding: 0 10px;
            background-color: transparent;
            border: none;
            font-weight: 400;
            display: flex;
            align-items: center;
        }

        .swap-icon{
            position: absolute;
            right: 10px;
            height: 28px;
            width: 28px;
            display: grid;
            place-items: center;
            background-color: white;
            border-radius: 100px;
            cursor: pointer;
            border: 1px solid #e4e3e3;
            background-color: #ece7e7;
            
            svg{
                font-size: 1.25rem;
            }

            &:hover{
                border: 1px solid #bfb8b8;
                background-color: #ece7e7;
                transition-duration: 500ms;
            }
        }
    }

    .two-fact-auth-req-link{
        width: 350px;
        font-size: 0.75rem;
        text-align: left;
        text-decoration: none;
        font-weight: 400;
    }

    .login-btn{
        height: 48px;
        width: 350px;
        display: grid;
        place-items: center;
        background-color: black;
        color: white;
        border-radius: 100px;
        margin-top: 15px;
        font-size: 0.85rem;
        cursor: pointer;
    }
`