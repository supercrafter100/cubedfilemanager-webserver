import { Socket } from "socket.io";
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { getSocketsWithServerId } from '../index';

export default class Session {

    public id: string;
    private socket: Socket;
    public server: number | undefined;
    private authenticated: boolean = false;
    private username: string | undefined;

    constructor(id: string, socket: Socket) {
        this.id = id;
        this.socket = socket;
        this.setEvents();

        console.log(`[${this.id}] Client connected`);
    }

    private setEvents() {
        this.socket.on('authenticate', (session, id) => this.handleAuthenticationRequest(session, id));
        this.socket.on('file_create', (name, content, path) => this.handleFileCreateEvent(name, content, path));
        this.socket.on('file_edit', (name, content, path) => this.handleFileEditEvent(name, content, path));
        this.socket.on('file_delete', (name, path) => this.handleFileDeleteEvent(name, path));
    }

    private async handleAuthenticationRequest(PHPSESSID: string, serverID: number) {
        const allowedServers = await getServersInDashboard(PHPSESSID);
        const server = allowedServers.find((server) => server.id === serverID);
        if (!server) {
            this.socket.emit('Unauthorized');
            return;
        }
        
        this.authenticated = true;
        this.server = serverID;
        this.socket.emit("authenticated");

        this.username = await getUsername(PHPSESSID);
        console.log(`[${this.id}] Client authorized working server ${server.name} (${server.id}) with username ${this.username}`)
    }

    private async handleFileCreateEvent(name: string, content: string, path: string) {
        if (!this.authenticated) return;
        const id = this.id;
        getSocketsWithServerId(this.server!).forEach((session) => {
            if (session.id !== id) {
                session.write('file_create', this.username, name, content, path);
            }
        })
    }

    private async handleFileEditEvent(name: string, content: string, path: string) {
        if (!this.authenticated) return;
        const id = this.id;
        getSocketsWithServerId(this.server!).forEach((session) => {
            if (session.id !== id) {
                session.write('file_edit', this.username, name, content, path);
            }
        })
    }

    private async handleFileDeleteEvent(name: string, path: string) {
        if (!this.authenticated) return;
        const id = this.id;
        getSocketsWithServerId(this.server!).forEach((session) => {
            if (session.id !== id) {
                session.write('file_delete', this.username, name, path);
            }
        })
    }

    public write(event: string, ...data: any) {
        this.socket?.emit(event, ...data);
    } 
}

	/**
	 * Get all servers the user has access to on their file manager
	 * @returns Array of all servers the user has access to
	 */
async function getServersInDashboard(session: string) : Promise<{ name: string, id: number }[]>{
    return new Promise(async (resolve) => {
        
        const headers = {
            cookie: `PHPSESSID=${session};`
        }

        const url = 'https://playerservers.com/account';
        await fetch(url, {
            headers: headers as any
        })
        .then((res) => res.text())
        .then(async (html) => {
            
            const links = [];
            const names: string[] = [];
            const hrefs: string[] = [];

            const $ = cheerio.load(html);
            $('tr > td:nth-child(1)').each((index, element) => {
                const name = $(element).text();
                names.push(name);
            })

            $('tr > td:nth-child(6) > a').each((index, element) => {
                const href = $(element).attr('href');
                if (href) {
                    hrefs.push(href);
                }
            })

            for (let i = 0; i < names.length; i++) {
                const name = names[i];
                const id = parseInt(hrefs[i].split('?s=')[1]);

                links.push({ name: name, id: id })
            }

            resolve(links);
        })
    })
}

async function getUsername(session: string) : Promise<string> {
    return new Promise(async (resolve) => {
        
        const headers = {
            cookie: `PHPSESSID=${session};`
        }

        const url = 'https://playerservers.com/account';
        await fetch(url, {
            headers: headers as any
        })
        .then((res) => res.text())
        .then(async (html) => {
            
            const $ = cheerio.load(html);
            const username  = $('body > div > nav > ul.navbar-nav.ml-auto > li.nav-item.dropdown > a').text().trim().replace(/\n/g, '');
            resolve(username);
        })
    })
}