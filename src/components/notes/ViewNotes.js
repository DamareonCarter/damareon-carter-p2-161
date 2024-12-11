import React, { useState } from "react";
import axios from "axios";

const ViewNotes = () => {
    const [noteData, setNoteData] = useState(new Array(0));

    const getNotes = async() => {
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            }
        
            const res = (await axios.get("http://localhost:5000/api/notes", config)).data;

            for (let i = 0; i < res.length; i++)
            {
                if (noteData.length < res.length)
                {
                    noteData.push(res[i]);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    getNotes();

    return (
        <div id="view-notes">
            <h2>View Notes (many need to reload page)</h2>
            {noteData.map((obj, i) => {
                return (
                    <article key={i}>
                        <h3><u>{obj.title}</u></h3>
                        <h4>ID: {obj._id}</h4>
                        <p>{obj.text}</p>
                    </article>
                )
            })}
        </div>
    )
}

export default ViewNotes;