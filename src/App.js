import React from 'react';
import './App.css';
import axios from 'axios';
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home.js";
import Register from "./components/Register.js";
import Login from "./components/Login.js";

class App extends React.Component
{
    state =
    {
        data: null,
        token: null,
        user: null
    }

    componentDidMount()
    {
        axios.get("http://localhost:5000")
        .then(response => this.setState({data: response.data}))
        .catch(error => console.error(`Error fetching data: ${error}`));
        this.authenticateUser();
    }

    authenticateUser = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            localStorage.removeItem('user');
            this.setState({ user: null });
        }

        if (token) {
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };

            axios.get('http://localhost:5000/api/auth', config)
                .then((response) => {
                    localStorage.setItem('user', response.data.name);
                    this.setState({ user: response.data.name })
                })
                .catch((error) => {
                    localStorage.removeItem('user');
                    this.setState({ user:null });
                    console.error(`Error logging in: ${error}`);
                });
        }
    }

    logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.setState({ user: null, token: null });
    }

    render()
    {
        let { user, data } = this.state;
        const authProps = {
            authenticateUser: this.authenticateUser
        };

        return (
            <div className='App'>
                <header className='App-header'>
                    <h1>WebNotes</h1>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/register">Register</Link></li>
                        {user ?
                            <li><Link to="" onClick={this.logout}>Log out</Link></li> :
                            <li><Link to="/login">Login</Link></li>
                        }
                    </ul>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<Home user={user} data={data} />}/>
                        <Route path="/register" element={<Register {...authProps} />}/>
                        <Route path="/login" element={<Login {...authProps} />}/>
                    </Routes>
                </main>
            </div>
        );
    }
}

export default App;