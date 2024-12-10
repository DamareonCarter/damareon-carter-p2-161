import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditNote = () => {
    const navigate = useNavigate();
    const [noteData, setNoteData] = useState({
        id: "",
        title: "",
        text: ""
    });
    const [errorData, setErrorData] = useState({ errors: null });

    const {id, title, text} = noteData;
    const {errors} = errorData;

    const onChange = e => {
        const {name, value} = e.target;

        setNoteData({
            ...noteData,
            [name]: value
        })
    }

    const editNote = async() => {
        const newNote = {
            title: title,
            text: text
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            }

            const body = JSON.stringify(newNote);
            await axios.put("http://localhost:5000/api/notes/" + id, body, config);

            navigate('/view_notes');

        } catch (error) {
            setErrorData({ ...errors, errors: error.response.data.errors });
        }
    }

    return (
        <div>
            <h2>Edit Note</h2>
            <div>
                <input type="text" placeholder="Note ID" name="id" value={id} onChange={e => onChange(e)}/>
            </div>
            <div>
                <input type="text" placeholder="Title" name="title" value={title} onChange={e => onChange(e)}/>
            </div>
            <div>
                <textarea placeholder="Text" name="text" value={text} rows={10} cols={50} onChange={e => onChange(e)}/>
            </div>
            <div>
                <button onClick={() => editNote()}>Create Note</button>
            </div>
            <div>
                {errors && errors.map(error =>
                    <div key={error.msg}>{error.msg}</div>
                )}
            </div>
        </div>
    )
}

export default EditNote;