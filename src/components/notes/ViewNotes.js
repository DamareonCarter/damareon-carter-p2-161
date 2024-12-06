import React, { useState } from "react";
import axios from "axios";

const ViewNotes = () => {
    const [noteData, setNoteData] = useState(new Array(0));

    const getNotes = async () => {
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            }
        
            const res = await axios.get("http://localhost:5000/api/notes", config);

            for (let i = 0; i < res.data.length; i++)
            {
                if (noteData.length < res.data.length)
                {
                    noteData.push(res.data[i]);
                }
            }

            return res.data;
        }
        catch (error) {
            console.log(error);
        }
    }

    getNotes();

    return (
        <div>
            <div>
                <h2>{noteData[0] ? noteData[0].title : ""}</h2>
                {noteData.map((obj) => {
                    return (
                        <div>
                            <h2>{obj.title}</h2>
                            <p>{obj.text}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ViewNotes;