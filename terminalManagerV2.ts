import * as vscode from 'vscode';

export class TerminalManager {
    private terminals;
    private lastTid;
    private lastCreatedTerminal;
    private lastTerminalIsShared;
    private vfsid;

    constructor(
        private eventEmitter
    ) {
        this.terminals = {};
        eventEmitter.on('terminal_process_created', (pty) => {
            this.terminals[pty["id"]] = {
                "terminal": this.lastCreatedTerminal,
                "pid": parseInt(pty["pid"]),
                "tid": this.lastTid,
                "shared": this.lastTerminalIsShared
            };

            this.lastCreatedTerminal.onDidAcceptInput(data => {
                this.eventEmitter.emit('send_ch4_message',
                    ["write", pty["id"], data.toString()]
                );
            
                if (this.lastTerminalIsShared) {
                    this.eventEmitter.emit('send_ch4_message',
                        ["call","collab","send",[this.vfsid,{"type":"GENERIC_BROADCAST","data":{"exttype":"terminal_udata","tid":pty["id"],"data":data.toString()}}]]
                    );
                }
            });
            this.lastCreatedTerminal.terminal.show();
            
            this.eventEmitter.emit('send_ch4_message',
                ["resize",pty["pid"],159,33]
            );
            this.eventEmitter.emit('send_ch4_message',
                ["tmux","",{"capturePane":{"start":-32768,"end":1000,"pane":"cloud9_terminal_" + this.lastTid + ":0.0"},"encoding":"utf8","name":"xterm-color","command":""},{"$":pty["id"]}]
            );
        });

        eventEmitter.on('ch4_data', (data, environmentId) => {
            if (Array.isArray(data)) {
                if (data.length>2) {
                    if (data[0] == "onEnd") {
                        if (Object.keys(this.terminals).map(Number).indexOf(data[1]) != -1) {
                            console.log("Terminating terminal");
                            this.closeTerminal(this.terminals[data[1]]);
                            delete this.terminals[data[1]];
                        }
                    } else if (data[0] == "onData") {
                        if (Object.keys(this.terminals).map(Number).indexOf(data[1]) != -1) {
                            console.log("Emitting terminal data");
                            this.emitTerminalData(this.terminals[data[1]], data[2]);
                        }
                    } else if (data[0] == 90) { // terminal creation channel
                        let contents = data[2];
        
                        console.log("Terminal Process Created");
                        eventEmitter.emit('terminal_process_created', contents["pty"]);
                    }
                }
            }
        });

        vscode.window.onDidCloseTerminal((closedTerminal) => {
            //delete this.terminals[t];    TODO: Fix clean up of dict
        });
    }

    addTerminal(shared: boolean, vfsid: string): void {
        this.vfsid = vfsid;
        this.lastTerminalIsShared = shared;

        let title = "Cloud9 Terminal";
        if (shared) {
            title = "Cloud9 Terminal (shared)";
        }
        
        this.lastCreatedTerminal = vscode.window.createTerminalRenderer(title);
    
        this.lastTid = Math.floor(900*Math.random()) + 100;

        this.eventEmitter.emit('send_ch4_message',
            ["tmux","",{"cwd":"/home/ec2-user/environment","cols":125,"rows":33,"name":"xterm-color","base":"/home/ec2-user/.c9","attach":false,"session":"cloud9_terminal_" + this.lastTid,"output":false,"terminal":true,"detachOthers":true,"defaultEditor":false,"encoding":"utf8","command":"bash -l"},{"$":90}]
        );

        if (shared) {
            this.eventEmitter.emit('send_ch4_message',
                ["call","collab","send",[this.vfsid,{"type":"GENERIC_BROADCAST","data":{"exttype":"terminal_create","tid":this.lastTid}}]]
            );
        }

        console.log("init'd remote terminal");
    }

    closeTerminal(terminal) {
        terminal.terminal.dispose();

        if (terminal['shared']) {
            this.eventEmitter.emit('send_ch4_message',
                ["call","collab","send",[this.vfsid,{"type":"GENERIC_BROADCAST","data":{"exttype":"terminal_destroy","tid":terminal['tid']}}]]
            );
        }
    }

    emitTerminalData(terminal, data) {
        if (typeof data == "string") {
            terminal['terminal'].write(data);
        }

        if (terminal['shared']) {
            this.eventEmitter.emit('send_ch4_message',
                ["call","collab","send",[this.vfsid,{"type":"GENERIC_BROADCAST","data":{"exttype":"terminal_sdata","tid":terminal['tid']}}]]
            );
        }
    }
}