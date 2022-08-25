// ==UserScript==
// @name         Autoplay queue
// @namespace    *
// @version      1.0
// @description  Second part of the floatplane video queue system
// @author       SgtBlade
// @match        https://www.floatplane.com/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=floatplane.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

        let videoQueue = [];

    //Gets loaded at the start
    const init = () => {
        createQueueMenu();
        //get queue from localstorage
        if(localStorage.getItem("videoQueue")){
            videoQueue = JSON.parse(localStorage.getItem("videoQueue"));
            videoQueue.forEach(video => updateQueueMenu("ADD", video))
        }


        checkIfVideoInQueue();
        setTimeout( startVideo, 500)
    }

    //play the next video when done
    const playNextVideo = () => {
        if(document.querySelector('.queueMenu a'))document.querySelector('.queueMenu a').click();
    }

    const startVideo = () => {
        document.querySelector('.vjs-poster').click()
        document.querySelector('video').addEventListener('ended', playNextVideo);
    }

    //Check if the video currently playing is from the queue & delete if so
    const checkIfVideoInQueue = () => {

        const currentVideo = window.location.href;

        let index = videoQueue.findIndex((queueItem) => { return queueItem.videoUrl === currentVideo})
        if(index !== -1){
           videoQueue.splice(index, 1);
           localStorage.setItem("videoQueue", JSON.stringify(videoQueue));
           document.querySelector(`.${window.location.pathname.split('/')[window.location.pathname.split('/').length-1]}`).remove();
        }

    }


    //updates the queue menu after adding a video
    const updateQueueMenu = (STATE, item) => {

        if(STATE === "ADD"){
            const $parentDiv = document.createElement('a');
            $parentDiv.href = item.videoUrl;
            $parentDiv.classList.add(item.videoUrl.split('/')[item.videoUrl.split('/').length-1])

            const $image = document.createElement('img');
            $image.src = item.videoThumbnail;

            const $title = document.createElement('p');
            $title.textContent = item.videoTitle;

            const $deleteButton = document.createElement('p');
            $deleteButton.textContent = 'X';
            $deleteButton.addEventListener('click', e => {updateQueueMenu("REMOVE", [item, e])});

            $parentDiv.style.cssText=
                `   max-height: 150px;
                    max-width: 330px;
                    display: grid;
                    grid-template-columns: 1fr 1fr 5%;
                    border-bottom: solid 1px black;
                    border-top: solid 1px black;`

            $image.style.cssText=
                `   object-fit: contain;
                    max-width: 100%;`

            $title.style.cssText=
                `       margin: 0;
                        font-weight: bold;
                        padding: 5px 10px;
                        font-size: 15px;
                        color: black;`

            $deleteButton.style.cssText=
                `       font-weight: bold;
                        margin: 2px;
                        font-size: 12px;
                        cursor: pointer;`


            $parentDiv.appendChild($image);
            $parentDiv.appendChild($title);
            $parentDiv.appendChild($deleteButton);

            document.querySelector('.queueMenu').appendChild($parentDiv);
        }
        else if(STATE === "REMOVE"){

            //I really don't get why the links on this site are so special
            //usually a preventDefault is enough
             item[1].stopPropagation();
             item[1].preventDefault();
             item[1].stopImmediatePropagation();
             iem[1].currentTarget.parentElement.remove();

            //Check for the correct index & remove from the array
            let index = videoQueue.findIndex((queueItem) => { return queueItem.videoUrl === item[0].videoUrl})
            videoQueue.splice(index, 1);
            localStorage.setItem("videoQueue", JSON.stringify(videoQueue));
        }
    }


    //Creating the queue menu
    const createQueueMenu = () => {
        const $queueMenu = document.createElement('div');
        $queueMenu.classList.add('queueMenu')
        $queueMenu.style.cssText  =
            `max-height: 370px;
            overflow-y: scroll;
            color: black;
            padding: 5px 0px;
            font-size: 18px;
            background-color: white;
            position: fixed;
            z-index: 999;
            bottom: 0;
            right: 0;
            `
        document.querySelector('body').appendChild($queueMenu);
    }

    //Simulates a user click, not my code but found it somewhere online a long time ago


    setTimeout(init, 1000)
})();