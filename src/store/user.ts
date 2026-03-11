import { defineStore } from "pinia";

export const userStore = defineStore("userStore", {
    state() {
        return {
            username: '--',
        }
    },
    actions: {
        changeUsername(newUsername: string) {
            if (newUsername && newUsername.length < 10) {
                this.username = newUsername;
                return this.username;
            }
        }
    },
    getters: {
        getUsername(): string {
            return this.username;
        }
    },
});