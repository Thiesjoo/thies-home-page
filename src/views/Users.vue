<template>
  <div class="container">
    <h1>User list for {{ user }}</h1>
    <p>
      Intial data from: {{ initTime }}. Last updated:
      {{ updateTime }}
    </p>
    <p>
      Deze lijst heeft: Alle chatters van de afgelopen 20 minuten en de
      viewerlijst van twitch zelf!
      <em
        >(This list has all chatters from the previous 20 minutes and the twitch
        viewerlist)</em
      >
    </p>
    <div class="content">
      <div class="twitchList">
        <h2 style="font-weight: 800">TwitchList</h2>
        <p>
          <em>Normale twitch viewerlist met alle chatters er nog bij</em>
        </p>
        <ul>
          <li
            style="list-style-type: none"
            v-for="(type, index) in types"
            :key="index"
          >
            <hr style="height: 20px" />
            <h3 style="font-weight: 800">{{ userFriendlyTypes[type] }}</h3>
            <ul>
              <li v-for="(item, index1) in users[type]" :key="index1">
                {{ item }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="liveList">
        <h2 style="font-weight: 800">LiveList</h2>
        <p>
          <em
            >Dit is de twitch viewerlist, met daarna alle chatters. Nieuwe
            gebruikers komen aan de onderkant van de lijst</em
          >
        </p>
        <ul class="extraList">
          <li
            v-for="(item, index1) in allUsers"
            :key="index1"
            :class="item.type"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatDate } from "@/helpers/formatDate";
import { defineComponent } from "@vue/runtime-core";
import { Client as TwitchChatClient } from "tmi.js";
const client = new TwitchChatClient({
  channels: [],
});

type UserTypes = "user" | "mod" | "vip";
type User = {
  name: string;
  type: UserTypes;
};

/** The frontend list doesn't really have to be in sync with backend, because lurking bots will not chat */
const BOTLIST = [
  "guanthebot",
  "madestoutbot",
  "cloudlog",
  "discord_for_streamers",
  "soundalerts",
  "streamelements",
  "streamlabs",
  "carbot14xyz",
  "commanderroot",
  "tiddly",
  "violets_tv",
];

const comp = defineComponent({
  data(): {
    users: {
      mod: string[];
      vip: string[];
      user: string[];
    };
    allUsers: User[];
    user: string;
    initialTime: Date | null;
    lastUpdatedTime: Date | null;
    types: UserTypes[];
    userFriendlyTypes: {
      mod: string;
      vip: string;
      user: string;
    };
  } {
    return {
      users: {
        mod: [] as string[],
        vip: [] as string[],
        user: [] as string[],
      },
      allUsers: [] as User[],
      initialTime: null,
      lastUpdatedTime: null,
      user: "",
      types: ["mod", "vip", "user"],
      userFriendlyTypes: {
        mod: "Mods 🍤",
        vip: "Vips 🦐",
        user: "Users 🥺",
      },
    };
  },
  computed: {
    initTime: function () {
      //@ts-ignore
      return this.initialTime !== null ? formatDate(this.initialTime) : "---";
    },
    updateTime: function () {
      //@ts-ignore
      return this.lastUpdatedTime !== null
        ? //@ts-ignore
          formatDate(this.lastUpdatedTime)
        : "---";
    },
  },
  async mounted() {
    console.log("Connecting to twitch");
    await client.connect();

    console.log(this.$route.query);

    const { user } = this.$route.query;
    const parsedUser = (Array.isArray(user) ? user[0] : user) || "madestout";
    this.user = parsedUser;
    client.join(parsedUser);

    const resp = await fetch(`api/twitch_users?user=${parsedUser}`);
    const data = await resp.json();
    if (!data.data) {
      return;
    }
    this.initialTime = new Date();
    this.lastUpdatedTime = new Date();
    this.allUsers = data.data;
    this.types.forEach((x) => {
      this.users[x] = filterArrayBasedOnType(data.sorted, x);
    });
  },
  created() {
    console.log("Registering callback");
    client.on("message", (channel, tags, message, self) => {
      let name = tags["display-name"]?.toLowerCase() || tags.username || "";
      let type: UserTypes = "user";
      if (tags.mod) {
        type = "mod";
      } else if (tags?.badges?.vip) {
        type = "vip";
      }

      if (
        !this.users[type].includes(name) && // No dupes
        !name.startsWith("justinfan") && // Anon twitch user.
        !BOTLIST.includes(name)
      ) {
        this.users[type].push(name);
        this.users[type].sort();
        this.allUsers.push({ name, type });
        this.lastUpdatedTime = new Date();
      }
    });
  },
  beforeDestroy() {
    console.log("Disconnecting from twitch");
    client.disconnect();
  },
});

export default comp;

function filterArrayBasedOnType<T, K>(
  arr: { type: T; name: K }[],
  type: T
): K[] {
  return arr.filter((x) => x.type === type).map((x) => x.name);
}
</script>

<style>
.content {
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-items: center;
  padding-bottom: 10%;
  padding-top: 1em;
}

.twitchList {
  order: 0;
  margin-bottom: 50px;
}

.liveList {
  order: 2;
}

.twitchList,
.liveList {
  max-width: 500px;
}

.extraList {
  margin-top: 1em;
  list-style: none; /* Remove default bullets */
}

.extraList li::before {
  content: "\2022"; /* Add content: \2022 is the CSS Code/unicode for a bullet */
  font-weight: bolder;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.mod::before {
  color: #1cb96a;
}

.vip::before {
  color: #e005b9;
}
</style>
