let initpos, map, marker;
let ws;
let players = {};
let nick = false;
let messageBoxHTML = document.getElementsByClassName('messages')[0];

function initMap() {
    nick = prompt('Podaj swój nick');
    if (!nick || nick.length < 1) {
        alert('Nie podałeś nicku, więc wejście jest niemożliwe');
        return false;
    }

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: initpos,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        keyboardShortcuts: false
    });

    //quick avatar generator
    const icon = {
        url: "https://robohash.org/" + nick,
        scaledSize: new google.maps.Size(45, 45),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };

    marker = new google.maps.Marker({
        position: initpos,
        map: map,
        animation: google.maps.Animation.DROP,
        title: nick,
        icon: icon
    });
    startWebSocket();
    addKeyboardEvents();
}

function addKeyboardEvents() {
    window.addEventListener('keydown', handleKeys)
}

function handleKeys(ev) {
    let lat = marker.getPosition().lat();
    let lng = marker.getPosition().lng();

    switch (ev.code) {
        case 'ArrowUp':
            lat += 0.05;
            break;
        case 'ArrowDown':
            lat -= 0.05;
            break;
        case 'ArrowLeft':
            lng -= 0.05;
            break;
        case 'ArrowRight':
            lng += 0.05;
            break;
        case 'Enter':
            handleMessageArea();
            return;
            break;
    }
    let position = {
        lat,
        lng
    };
    let wsData = {
        lat: lat,
        lng: lng,
        id: nick,
        type: 'map',
    };
    marker.setPosition(position);
    map.panTo(marker.getPosition());
    ws.send(JSON.stringify(wsData));
}

function startWebSocket() {
    let url = 'ws://185.193.113.121:8010';
    ws = new WebSocket(url);
    ws.addEventListener('open', onWSOpen);
    ws.addEventListener('message', onWSMessage)
}

function onWSOpen(data) {
    console.log(data);
    appendMessage('System: Witaj ' + nick + '!');
    getLocalization();
}

function onWSMessage(e) {
    let data = JSON.parse(e.data);
    console.log(data);

    if (data.type === 'map') {
        if (!players['user' + data.id]) {
            players['user' + data.id] = new google.maps.Marker({
                position: {lat: data.lat, lng: data.lng},
                map: map,
                animation: google.maps.Animation.DROP,
                icon: {
                    url: "https://robohash.org/" + data.id,
                    scaledSize: new google.maps.Size(45, 45),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 0)
                }
            });

            if(data.hasOwnProperty('flag') && data.flag === 'init') {
                let wsData = {
                    lat: marker.getPosition().lat(),
                    lng: marker.getPosition().lng(),
                    id: nick,
                    type: 'map'
                };
                ws.send(JSON.stringify(wsData));
            }

        } else {
            players['user' + data.id].setPosition({
                lat: data.lat,
                lng: data.lng
            })
        }
    }

    if (data.type === 'chat' && data.id !== nick) {
        appendMessage(data.id + ': ' + data.message, false);

    }
}


function getLocalization() {
    navigator.geolocation.getCurrentPosition(geoOk, geoFail)

}

function geoOk(data) {
    let coords = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
    };
    initpos = coords;
    map.setCenter(coords);
    marker.setPosition(coords);


    let wsInitData = {
        lat: initpos.lat,
        lng: initpos.lng,
        id: nick,
        type: 'map',
        flag: 'init',
    };
    ws.send(JSON.stringify(wsInitData));


    const wsInitMessage = {
        message: nick + ' dołączył do zabawy',
        id: 'System',
        type: 'chat',
    };
    ws.send(JSON.stringify(wsInitMessage))
}

function geoFail(err) {
    alert('Brak uprawnień do pobrania geolokalizacji.')
}

function appendMessage(message, type) {
    const messageType = (type === 'client') ? 'client-message' : 'other-message';

    const messageEl = document.createElement('div');
    messageEl.classList.add('message-insert');
    messageEl.classList.add(messageType);
    messageEl.innerText = message;

    messageBoxHTML.appendChild(messageEl);
}

function handleMessageArea() {
    const messageAreaEl = document.getElementsByClassName('user-textarea')[0];
    const message = messageAreaEl.value;

    if (message && message.length > 0) {
        appendMessage(nick + ': ' + message, 'client');
        messageAreaEl.value = '';
        messageAreaEl.blur();

        const wsMessage = {
            message,
            id: nick,
            type: 'chat'
        };
        ws.send(JSON.stringify(wsMessage))
    }
    return false;
}