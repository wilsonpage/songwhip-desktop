'use strict';

var path = require('path')
var electron = require('electron');
const debug = require('debug')('songwhip:main');
var BrowserWindow = electron.BrowserWindow;
const {app, Menu, MenuItem, Tray, clipboard, shell } = require('electron');

const clipboardListener = require('electron-clipboard-extended')
const { NotificationCenter } = require('node-notifier');


const createMessage = require('./lib/create-message');
const songwhip = require('./lib/songwhipify');
const getLink = require('./lib/get-link');

var notifier = new NotificationCenter();

var trayIcon = null;
var window = null;

const TRAY_ARROW_HEIGHT = 50;
const WINDOW_WIDTH = 600;
const WINDOW_HEIGHT = 400;
const HORIZ_PADDING = 15;
const VERT_PADDING = 15;

app.on('ready', function() {
  if (process.platform === 'darwin') app.dock.hide();

  // window = new BrowserWindow({
  //   width: WINDOW_WIDTH,
  //   height: WINDOW_HEIGHT,
  //   resizable: false,
  //   frame: false,
  //   transparent: true,
  //   show: false
  // });

  // window.loadURL('file://' + __dirname + '/index.html');

  // window.on('close', function () {
  //   window = null;
  // });

  // window.on('blur', function(){
  //   window.hide();
  // });

  const iconName = 'images/icon.png';
  const iconPath = path.join(__dirname, iconName);

  trayIcon = new Tray(iconPath);
  trayIcon.setToolTip('Hello World');

  clipboardListener
    .on('text-changed', async () => {
      debug('clipboard change')
        const link = getLink(clipboard.readText());
        if (!link) {
          debug('no link in clipboard text');
          return;
        }

        const json = await songwhip(link);

        if (!json) {
          debug('no songwhip data');
          return;
        }

        const title = createMessage(json);
        const body = 'Click to copy';

        notifier.notify({
          title,
          message: body,
          icon: undefined,
          sound: false, // Only Notification Center or Windows Toasters
          timeout: 20,
          // open: json.url,
          closeLabel: 'Close',
          actions: 'Show',
        },
        function(err, response, { activationValue }) {
          debug('notification callback', err, response, activationValue);
          if (activationValue === 'Show') shell.openExternal(json.url);
        });

        notifier.on('click', (notifierObject, options) => {
          debug('notification click', options);
          clipboard.writeText(json.url);
        });
    })
    .startWatching();

  // trayIcon.on('click', (event) => {
  //   menu.popup(window);
  // });

  var menu = new Menu();
  menu.append(new MenuItem({ label: 'A', click: () => app.quit() }));
  menu.append(new MenuItem({ label: 'B', click: () => app.quit() }));
  menu.append(new MenuItem({ label: 'Quit', click: () => app.quit() }));

  trayIcon.setContextMenu(menu);

  // var ipcMain = require('electron').ipcMain;
  // ipcMain.on('show-config-menu', (event) => {
  //     menu.popup(window);
  // });

});