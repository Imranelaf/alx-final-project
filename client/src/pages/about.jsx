import React, { useState } from "react";
import Navbar from '../components/navbar.jsx';
import '../assets/styles/about.css';
import '../assets/styles/card.css';
import agents from '../../../server/config/agents.js';
import FrequentlyQuestions from '../../../server/config/FrequentlyQuestions.js';

export default function About() {
    const [show, setShow] = useState({});

    function expend(id) {
        setShow((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    }

    return (
        <>
            <Navbar />
            <div className="about">
                <h1>About PropertyHUB</h1>
            </div>

            <div className="ourCompany">
                <img className="image" src="https://cdn.pixabay.com/photo/2017/01/14/10/56/people-1979261_640.jpg" alt="" srcset="" />
                <div className="info">

                    <h2>OUR COMPANY</h2>
                    <p>Illum repudiandae ratione facere explicabo. Consequatur dolor optio iusto, quos autem voluptate ea? Sunt laudantium fugiat, mollitia voluptate? Modi blanditiis veniam nesciunt architecto odit voluptatum tempore impedit magnam itaque natus!</p>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Atque itaque officiis pariatur autem sint illo. Eaque, autem assumenda nisi, repudiandae laborum itaque laboriosam ipsum deleniti repellat laudantium expedita eligendi impedit.</p>
                </div>

            </div>

            <div className="agents">
                <h2>OUR AGENTS</h2>
                <div className="cardsContainer">
                    {
                        agents.map(item => (
                            <div className="card" key={item.id}>
                                <div className="agent" style={{ backgroundImage: `url("${item.pic}")` }}></div>

                                <div className="information">
                                    <h3>{item.name}</h3>
                                    <p>{item.role}</p>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="Qfreq">
                <h1>Frequently Asked Questions</h1>
                {
                    FrequentlyQuestions.map(item => (
                        <div key={item.id}>
                            <div className="question">
                                <h4>{item.question} <button onClick={() => expend(item.id)}>{show[item.id] ? "Show Less" : "Show More"}</button></h4>
                                {show[item.id] && <p>{item.answer}</p>}
                            </div>
                        </div>
                    ))
                }
            </div>

        </>
    );
}