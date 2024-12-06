import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeleteNote = () => {
    const navigate = useNavigate();
    const [noteID, setNoteID] = useState({
        id: ""
    })
    const [errorData, setErrorData] = useState({ errors: null });

    const { id } = noteID;
    const { errors } = errorData;

    const onChange = e => {
        const {name, value} = e.target;

        setNoteID({
            ...noteID,
            [name]: value
        })
    }

    const deleteNote = async() => {
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            }

            await axios.delete("http://localhost:5000/api/notes/" + id, config);

            navigate('/view_notes');
        }
        catch (error) {
            setErrorData({ ...errors, errors: error.response.data.errors });
        }
    }

    return (
        <div>
            <h2>Delete Note</h2>
            <div>
                <input type="text" placeholder="Note ID" name="id" value={id} onChange={e => onChange(e)}/>
            </div>
            <div>
                <button onClick={() => deleteNote()}>Delete Note</button>
            </div>
            <div>
                {errors && errors.map(error =>
                    <div key={error.msg}>{error.msg}</div>
                )}
            </div>
        </div>
    )
}

export default DeleteNote;