import React, { useState } from 'react';

function  LandingPage({ user } = props) {
    const [userContent, setUserContent] = useState('');
    
    const handleSubmit = (e) => {
    
        e.preventDefault();

        console.log(`Form submitted, ${userContent}`);    

    }

    
    return (
        <div>
            <div className={"scroller"}>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
                <b> Vision-Aid and OMSCS collaboration</b>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <form onSubmit = {handleSubmit}>
                    <input onChange = {(e) => setUserContent(e.target.value)} value = {userContent}></input>
                    <button type = 'submit'>Click to submit</button>
                </form>

                <br></br>
                <br></br>
                <div>
                    <div className={"box box1"}> <img src="https://visionaid.org/wp-content/uploads/2024/01/DSC_9437-1536x1028.jpg" alt="Vision-Aid’s Journey of Empowerment at Sankara Nethralaya, Chennai" /> </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className={"box box1"}> <img src="https://visionaid.org/wp-content/uploads/2024/02/image.jpeg" alt="About the center in SN Chennai" /> </div>  
                   <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className={"box box1"}> <img src="https://visionaid.org/wp-content/uploads/2024/01/image_2024-01-31_192032823.png" /> </div>  
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    More stories of success..
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    Thanks!
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>      
            </div>
        </div>
    );
}

export default  LandingPage;