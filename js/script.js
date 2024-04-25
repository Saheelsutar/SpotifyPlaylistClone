let currentSong=new Audio;
let songs
let currfolder
function convertSecondsToMinutesSeconds(seconds) {
    if(isNaN(seconds)|| seconds<0){
        return "00:00"
    }
    seconds = Math.round(seconds);
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    var minutesString = minutes < 10 ? "0" + minutes : minutes;
    var secondsString = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
    return minutesString + ":" + secondsString;
}
async function getSongs(folder){
    currfolder=folder
    let a = await fetch(` /${folder}/`)
    let response= await a.text();
    let div=document.createElement('div');
    div.innerHTML=response;
    let as = div.getElementsByTagName('a')
     songs=[]
     //filtering of songs name in the song Playlist
    for (let index = 0; index < as.length; index++) {
        const element = as[index]
        if(element.href.endsWith(".mp3")){
            let s= element.href.split(`/${folder}/`)[1];
            songs.push(s)
        }
    }
    
let songUl = document.querySelector(".songLists").getElementsByTagName("ul")[0]
songUl.innerHTML=""
for (const song of songs) {
    songUl.innerHTML= songUl.innerHTML +   `<li>
             <img class="invert" src="img/music.svg" alt="">
                                <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Saheel</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">   
                            </div></li>`

}

//attach an event listener to each song
Array.from(document.querySelector(".songLists").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        
    })
})

return songs
}
const playMusic=(track,pause=false)=>{
currentSong.src=`/${currfolder}/`+track
if(!pause){
    currentSong.play();
    play.src="img/pause.svg"
}
document.querySelector(".songInfo").innerHTML=decodeURI(track)
document.querySelector(".songTime").innerHTML="00:00/00:00"

}

async function displayAlbums(){
let a = await fetch(`./songs/`)
let response= await a.text();
let div=document.createElement('div');
div.innerHTML=response;
let anchors=div.getElementsByTagName("a")
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
    if(e.href.includes("./songs") && !e.href.includes(".htaccess")){
        let foldername=(e.href.split("/").slice(-2)[0]);
        //Get the metadata of the folder
        let a = await fetch(`./songs/${foldername}/info.json`)
        let response= await a.json();
        let container = document.querySelector(".cardContainer");
        container.innerHTML=container.innerHTML+` <div data-folder=${foldername} class="card">
        <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="65" height="65">
                <circle cx="32.5" cy="32.5" r="32.5" fill="#1ed760" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="62" height="59" color="#412f2f" fill="black" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                    <g transform="translate(1, 1)">
                        <path d="M8 5V19L19 12L8 5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                </svg>
            </svg>
        </div>
        <img class="rounded" src="./songs/${foldername}/cover.jpeg" alt="Image not Found">
        <h3>${response.title}</h3>
        <p>${response.description}</p>
    </div>`
        
    }
}
  //Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        songs =await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0])
        var x = window.matchMedia("(max-width: 1200px)")
        if (x.matches) { 
        document.querySelector(".left").style.transition = "all 0.3s;"
        document.querySelector(".left").style.left = "0%";
        } else {
        }
    })
})

}

async function main(){
   await getSongs("songs/LatestSongs")
    playMusic(songs[0],true)

//Display all the albums on the page
displayAlbums()


//Attach an event listener to play, next and previous
play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="img/pause.svg"
    }else{
        currentSong.pause()
        play.src="img/play.svg"
    }
})
//listen for timeupdate event
currentSong.addEventListener("timeupdate",()=>{
    document.querySelector(".songTime").innerHTML=`${convertSecondsToMinutesSeconds(currentSong.currentTime)} / ${convertSecondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
    
})
//add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click",(e)=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100+"%";

    currentSong.currentTime=((currentSong.duration)*percent)/100
    
})
//add an event listener to hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0%"
})
//add an event listener to close
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%"
})
//add an event listener to previous
previous.addEventListener("click",()=>{
    currentSong.pause()
let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
if((index-1)>=0){
    playMusic(songs[index-1])
}

})
//add an event listener to next
next.addEventListener("click",()=>{
    currentSong.pause()
    let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
     if((index+1)< songs.length){
        playMusic(songs[index+1])
     }
    
    })
    let currVol;
    //add an event to volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume=parseInt(e.target.value)/100
        if(currentSong.volume>0){
            volume.src="img/vol.svg"  
        }
    })

    //add an event listener to mute the track
    document.querySelector("#volume").addEventListener("click",(e)=>{

        if(currentSong.volume==0.0){
            currentSong.volume=1.0
            document.querySelector(".range").getElementsByTagName("input")[0].value=100
            volume.src="img/vol.svg"
        }else{
            currentSong.volume=0.0
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
            volume.src="img/mute.svg"
        }
       
    })
  
     

}
//  you have  reached 4:46:26
main()
