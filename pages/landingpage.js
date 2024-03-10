import React, { use, useState } from 'react';
import Router from "next/router";

import Image from 'next/image'
import p1 from 'public/images/p1.webp';
import p2 from 'public/images/p2.webp';
import p3 from 'public/images/p3.webp';


async function addUserContent(userId,userContent ) {
    console.log("adding content to user id" + userId);
    const addConfirmation = await fetch("/landingpage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userId,
        content: userContent,
      }),
    });
    if (addConfirmation.status !== 200) {
      console.log("something went wrong");
    } else {
      console.log("form submitted successfully !!!");
    //   Router.reload();
    }
  }
  


const addUser = async (e) => {
    e.preventDefault();
    const uid = document.getElementsByTagName("small")[1].innerHTML.split(": ")[1]
    const ueml = document.getElementsByTagName("small")[0].innerText.split(" ")[3]
    const ucnt = document.getElementsByClassName("user-content")[0].value

    console.log("\n........u-id .......")
    console.log(uid)
    console.log("\n........u-email.......")
    console.log(ueml)
    console.log("\n........u-content .......")
    console.log(ucnt)

    // addUserContent(uid, ucnt)
    addUserContent(2, ucnt)

    


  };

function  LandingPage({ user } = props) {
    const [userContent, setUserContent] = useState("");
    // const [landingUser, setlandingUser] = useState("");
    
    const handleUserContent = (e) => {
        e.preventDefault();
        console.log(e.target.value)
        setUserContent(e.target.value);     
      };

    
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
                <form action="#" method="POST" onSubmit={(e) => addUser(e)}>
                    <label>Add user content here: </label> 
                    <input type="text" className='user-content'
                     value={userContent} onChange={handleUserContent} 
                    />
                    <br /> 
                    <br /> 
                    <button type="submit">Submit</button> 
                </form>
                <br></br>
                <br></br>
                <div>
                    {/* <div className={"box box1"}> <img src="https://visionaid.org/wp-content/uploads/2024/01/DSC_9437-1536x1028.jpg" alt="Vision-Aid’s Journey of Empowerment at Sankara Nethralaya, Chennai" /> </div> */}
                    <div className="img-grid">
                        <Image
                            src={p1}
                            width={200}
                            height={100}
                            />
                    </div>                
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
                    {/* <div className={"box box1"}> <img src="https://visionaid.org/wp-content/uploads/2024/02/image.jpeg" alt="About the center in SN Chennai" /> </div>   */}
                    <div className="img-grid">
                        <Image
                            // src="https://visionaid.org/wp-content/uploads/2024/02/image.jpeg"
                            src={p2}
                            width={300}
                            height={200}
                            />
                    </div>
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
                    {/* <div className={"box box1"}> <img src="https://visionaid.org/wp-content/uploads/2024/01/image_2024-01-31_192032823.png" /> </div>   */}
                    <div className="img-grid">
                        <Image
                            src={p3}
                            width={200}
                            height={200}
                        />
                    </div>
                    
                    
                    
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