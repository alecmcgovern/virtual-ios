import React, { Component } from 'react';
import './App.css';

class App extends Component {

    componentDidMount() {
        // navigator.getUserMedia = navigator.getUserMedia ||
        //                         navigator.webkitGetUserMedia ||
        //                         navigator.mozGetUserMedia ||
        //                         navigator.msGetUserMedia;

        // if (navigator.mediaDevices.getUserMedia) {

        navigator.mediaDevices.getUserMedia({audio: true, video: true}, function(stream) {
            this.webcamInput = window.URL.createObjectURL(stream);
        }, () => {
            console.log("getUserMedia failed");
        });

        // } else {
        //     video.src = 'somevideo.webm'; // fallback.
        // }
    }

    render() {
        return (
            <div className="app">
                <div className="header"></div>
                <video className="video" ref={(element) => { this.webcamInput = element; }} autoPlay></video>
            </div>
        );
    }
}

export default App;
