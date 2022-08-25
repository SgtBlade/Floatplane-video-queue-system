// ==UserScript==
// @name         ViewingQueue
// @namespace    https://github.com/SgtBlade/Floatplane-video-queue-system/blob/main/ViewingQue.user.js
// @version      1.0
// @description  Add videos you want to watch to a queue
// @author       SgtBlade
// @match        https://www.floatplane.com/channel/linustechtips/*
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

        //Select all video's and create the buttons
        const $videoElements = document.querySelectorAll('.PostTileThumbnail');
        createQueueButtons($videoElements);

        //Check every scroll for new video's
        //I tried to do an eventlistener with change on the wrapper but it did not detect the changes
        document.addEventListener('scroll', checkForNewVids)



    }

    //Checks for new elements
    const checkForNewVids = () => {
        //:has(:not... did not work so I had look for the only childs and modify the button creation function
        let $newVideoElements = document.querySelectorAll('.proto-image.thumbnail-image.loaded:only-child');
        if($newVideoElements.length !== 0) createQueueButtons($newVideoElements, true);
    }


    //Ads video to the queue
    const AddToQueue = (e) => {
        //It somehow needs all these 3 to stop it from opening the video
        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();

        //This is the way (we need all info about the video, when we click we only have the p element of the button)
        const $videoElement = e.currentTarget.parentElement.parentElement.parentElement;
        const queueItem = {
             videoTitle: $videoElement.querySelector('.PostTileInfoHorizontalWrapper a div').title,
             videoUrl: $videoElement.querySelector('a').href,
             videoThumbnail: $videoElement.querySelector('img').src
        }

        //Preventing duplicates & saving it also in the localstorage
        if(videoQueue.filter(queue => queue.videoUrl === queueItem.videoUrl).length === 0){
           videoQueue.push(queueItem)
           localStorage.setItem("videoQueue", JSON.stringify(videoQueue));
           updateQueueMenu("ADD", queueItem);
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


    //Creating the queue buttons
    const createQueueButtons = ($videoElements, requiresConversion = false) => {

         //The Video's are DOM elements so we neet to use some trickery to do a foreach on them
         Array.prototype.forEach.call($videoElements, ($videoElement, key) => {

              //Because I couldn't find a way to select them propperly we sometimes need to go to the parent element
              if(requiresConversion)$videoElement = $videoElement.parentElement;

             //Creation of the queue icon
              const $queueButton = document.createElement('p');
              $queueButton.textContent = '►=';
              $queueButton.classList.add('queueButton')
              $queueButton.style.cssText  =
                  `
                  margin: 0;
                  color: white;
                  padding: 5px 0px;
                  font-size: 18px;
                  background-color: rgba(0, 0, 0, 0.5);
                  position: fixed;
                  z-index: 999;
                  right: 0%;
              `
              $queueButton.addEventListener('click', AddToQueue)
              $videoElement.appendChild($queueButton)

          });
    }

    //Begin the script after waiting for a second, the videos need to be fetched first
    setTimeout(init, 1000)



})();
