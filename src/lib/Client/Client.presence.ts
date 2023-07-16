import { debugBot } from "../Debug";
import { getNextArrayElement, getRandomArrayUniqueElement } from "../utils";
import { EPresenceUpdateStatus, IActivities, IClient$Presence } from "./Client.types";
import { Client as DiscordClient, PresenceStatusData } from 'discord.js';

const setPresence = (client: DiscordClient<true>, presence: IActivities): void => {
    client.user.setPresence({
        status: presence.status as PresenceStatusData,
        activities: [presence]
    });
}

const startPresenceAutoUpdate = (client: DiscordClient<true>, presence: IClient$Presence) => {
    const { activities, presenceUpdateFrequency, updateOrder } = presence;
    const randomPosition = Math.floor(Math.random() * activities.length);
    const actualPresence = {
        arrayPosition: randomPosition,
        activity: activities[randomPosition]
    }

    setInterval(async () => {
        if (updateOrder === EPresenceUpdateStatus.OriginalOrder) {
            const { element, newPosition } = getNextArrayElement(activities, actualPresence.arrayPosition);
            actualPresence.arrayPosition = newPosition;
            actualPresence.activity = element;
        } else if (updateOrder === EPresenceUpdateStatus.Random) {
            const { element, position } = getRandomArrayUniqueElement(activities, actualPresence.activity, '_id');
            actualPresence.arrayPosition = position;
            actualPresence.activity = element;
        }
        setPresence(client, actualPresence.activity);
    }, presenceUpdateFrequency);
}

export const startPresenceService = (client: DiscordClient<true>, presence: IClient$Presence) => {
    const firstPresence = presence.activities[0];
    setPresence(client, firstPresence);
    if (presence.activities.length > 0) startPresenceAutoUpdate(client, presence);
}