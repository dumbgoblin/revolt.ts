'use strict';
class User {
  id: number;
  username: string;
  displayname: string;
  constructor(id: number, username: string, displayname: string) {
    this.id = id;
    this.username = username;
    this.displayname = displayname;
    usersArray.push(this);
  }
}
const Settings = {
  CHANNEL_ID: '',
  XSESSIONTOKEN: '',
  maxUsernameLength: 20,
};
const getChannelInfo = `https://api.revolt.chat/channels/${Settings.CHANNEL_ID}`;
const userHeaders = new Headers();
const Messages: any[] = [];
const usersArray: any[] = [];
function newUsr(id: number, us: string, ds: string) {
  new User(id, us, ds);
}

userHeaders.append('X-SESSION-TOKEN', Settings.XSESSIONTOKEN);
const requests = {
  messagesInChannel: new Request(
    `${getChannelInfo}/messages?include_users=true`,
    {
      headers: userHeaders,
    }
  ),
};
function usernamer(user: any) {
  newUsr(user._id, user.username, user.display_name);
}

fetch(requests.messagesInChannel, { headers: userHeaders })
  .then((response) => response.json())
  .then((json) => {
    json.users.forEach((user: any) => {
      usernamer(user);
    });

    usersArray.forEach((user) => {
      if (user.displayname && user.displayname !== '឵឵឵឵឵឵឵឵') {
        if (user.displayname.length >= Settings.maxUsernameLength) {
          user.displayname =
            user.displayname.slice(Settings.maxUsernameLength) + '...';
        }
      } else {
        if (user.username.length >= Settings.maxUsernameLength) {
          user.displayname =
            user.username.slice(Settings.maxUsernameLength) + '...';
        }
      }
    });

    const assocArray: any[] = [];
    class UMAssoc {
      arrayElement: number;
      AssocID: string;
      username: string;
      displayname: string | null;
      constructor(
        arrayElement: number,
        AssocID: string,
        username: string,
        displayname: string | null
      ) {
        this.arrayElement = arrayElement;
        this.AssocID = AssocID;
        this.username = username;
        this.displayname = displayname;
        assocArray.push(this);
      }
    }

    json.messages.forEach((message: any) => {
      Messages.push(message);
      usersArray.forEach((user, index) => {
        if (user.id === message.author) {
          new UMAssoc(
            index,
            message.author,
            user.username,
            user.displayname || null
          );
        }
      });
    });
  });
