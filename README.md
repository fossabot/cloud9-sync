# Live Sync for AWS Cloud9

>**Note:** This extension is still in alpha stages. Please [raise an issue](https://github.com/iann0036/cloud9-sync/issues) if you experience any problems.

![Live Sync for AWS Cloud9 Screenshot](https://raw.githubusercontent.com/iann0036/cloud9-sync/master/resources/screenshot.png)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fiann0036%2Fcloud9-sync.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fiann0036%2Fcloud9-sync?ref=badge_shield)

## Setup

To start using this extension, you'll need an AWS IAM Key Pair in order to authenticate you. We initally recommend assigning the [AWSCloud9Administrator](https://console.aws.amazon.com/iam/home#/policies/arn:aws:iam::aws:policy/AWSCloud9Administrator$jsonEditor) role to your user.

You can enter your key-pair by clicking on the Environments refresh button, or by hitting `F1` and entering the `Cloud9 Sync: Setup` option. This will present the field you need to fill in order to give that workspace access.


## Connecting

Once you've entered your credentials, click the refresh button in the Environments view. This should populate all environments to which you have access to. You can connect to your chosen environment by right-clicking on the item and clicking `Connect`. Connection may take up to a minute to fully complete and will initially synchronize your workspace.


## Adding to workspace

If you'd like to have the remote file listing available in your Explorer, you can click `Add to Workspace` from the Environments view. This will add the file listings as a seperate workspace folder. You can save the workspace to persist the workspace folder in the future.

>**Note:** There is a [known issue](https://github.com/Microsoft/vscode/issues/46048) that makes Visual Studio Code restart when adding the folder. This means that the connection must be re-established when adding the folder to an existing workspace.


## Disconnecting

Similarly to connecting, you may disconnect by right-clicking on the connected environment and clicking `Disconnect`.


## Using Remote Terminal

You can right-click on your connected environment and click the `Create Terminal` option. This will open a new terminal connected to your AWS Cloud9 environment.

If you choose the `Create Shared Terminal` option, your terminal will be available to other online clients.


## Settings

Though most settings will be available to you from the sidebar, here is the list of all [settings](https://code.visualstudio.com/docs/getstarted/settings) you can set:

Setting | Description | Set When
------- | ----------- | --------
`cloud9sync.region` | Specifies the AWS Cloud9 region | Refreshing for the first time
`cloud9sync.accessKey` | Your AWS access key for authenticating to the environment | Refreshing for the first time
`cloud9sync.secretKey` | Your AWS secret key for authenticating to the environment | Refreshing for the first time
`cloud9sync.syncStrategy` | How to synchronize a connected environment | Initially connecting to an environment
`cloud9sync.proxy` | HTTP proxy used to connect to environments (format: http://1.2.3.4:8888) | None (only manually set)
`cloud9sync.assumeRole` | The ARN of a role to assume into | None (only manually set)
`cloud9sync.mfaSerial` | The serial number or ARN of your MFA device | None (only manually set)
`cloud9sync.sessionDuration` | The duration (in seconds) of the STS session | None (only manually set)


## Troubeshooting

> User: arn:aws:iam::xxxxxxxxxx:user/xxxxxxx is not authorized to perform: cloud9:CreateEnvironmentToken on resource: xxxxxxxxxxxxxxx with an explicit deny

This error generally indicates the creator of the Cloud9 environment has not shared the environment with the user you're trying to log in as. You should log in to the Cloud9 web interface and [share the environment](https://docs.aws.amazon.com/cloud9/latest/user-guide/share-environment.html#share-environment-invite-user) with your Visual Studio Code user.

> Cannot resolve workspace folder

This warning can sometimes be shown when you have added an environment to the workspace and presents the new workspace folder in yellow. This can generally be ignored and will go away when the environment completes its connection. If you do see other issues with this behaviour, please [raise an issue](https://github.com/iann0036/cloud9-sync/issues).


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fiann0036%2Fcloud9-sync.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fiann0036%2Fcloud9-sync?ref=badge_large)