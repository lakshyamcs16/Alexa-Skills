# Alexa Node.JS CLI environment setup
![N|Solid](https://s3.amazonaws.com/spellbeebackend/amazon-alexa-logo.png)

Things you will need before starting:

  - Account on [Amazon developer](https://developer.amazon.com/)
  - Account on [Amazon AWS](https://aws.amazon.com/console/)
  - [Python](https://www.python.org/downloads/release/python-364/) on your local machine
  - [node.js](https://www.npmjs.com/get-npm) and [npm](https://www.npmjs.com/get-npm)

# Step 1: Installing Alexa Skill Kit (ASK)

  - Download and install alexa skill kit
    ```sh
    $ npm install ask-cli
    ```
  - If it shows an error of MSB3428, try this:
    ```sh
    $ npm install --global --production windows-build-tools
    ```
    This will install the alexa skill kit on your local machine.

# Step 2: Installing AWS Kit
  - To install aws cli use pip command:
    ```sh    
    $ pip install awscli --upgrade --user    
    ```
 # OR
 - You can directly [download](https://docs.aws.amazon.com/cli/latest/userguide/awscli-install-windows.html) the .msi file (Windows Users)

# Step 3: Setting environment variable
> After installing with pip, add the aws executable to your OS's PATH environment
> variable. With an MSI installation, this should happen automatically, but you may
> need to set it manually if the aws command is not working.

### Steps to setup environment variable
- To modify your PATH variable (Windows)
- Press the Windows key and type environment variables.
- Choose Edit environment variables for your account.
- Choose PATH and then choose Edit.
- Add paths to the Variable value field, separated by semicolons. For example: C:\existing\path;C:\new\path
- Choose OK twice to apply the new settings.
- Close any running command prompts and re-open.

# Step 4: Getting credentials from AWS account

- Open the IAM console.
- In the navigation pane of the console, choose Users.
- Choose your IAM user name (not the check box).
- Choose the Security credentials tab and then choose Create access key.
- To see the new access key, choose Show. Your credentials will look something like this:
    - Access key ID: AKIAIOSFODNN7EXAMPLE
    - Secret access key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
- To download the key pair, choose Download .csv file. Store the keys in a secure location as you will be able to see Secret key only once when you generate it. However, you can generate it more than once.

# Step 5: Configuring aws on local machine
- Type the command in the terminal:
- **default** is the profile name. You can create your own profile or use the default one.
    ```sh
    $ aws configure --profile default
    AWS Access Key ID [None]: AKIAI44QH8DHBEXAMPLE
    AWS Secret Access Key [None]: je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY
    Default region name [None]: us-east-1
    Default output format [None]: text
    ```

# Step 6: Building and deploying Hello World skill using CLI
- ### Initialization
    The first time you use ASK CLI, you must call the init command to initialize the tool with your Amazon developer account.
    ```sh
    $ ask init
     ```
    You will be prompted to select your profile and to log in to your developer account. Once the initialization is complete, you can use ASK CLI to manage your skills.

- ### Creating a new skill
    The ask new command allows you to quickly create a new Alexa skill.
    ```sh
    $ ask new --skill-name my-skill
    $ cd my-skill
    $ ask deploy
    ```
    This will create a fully working "Hello World" skill that can be enabled and invoked immediately. If you make any subsequent changes, just use ask deploy again to deploy all of your changes.

    > If you get error related to permissions on role or lambda function. You need to add the following JSON code to the CreatePolicy(it's a name of the policy that you need to create) section in IAM > Users.

    ### Creating a policy
    - Open the IAM console.
    - In the navigation pane of the console, choose Users.
    - Choose your IAM user name (not the check box).
    - Click on **Add inline policy** at the bottom right corner
    - Paste the following code in the JSON tab
    **IMAGE**

    ```json
        {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "VisualEditor0",
                "Effect": "Allow",
                "Action": [
                    "lambda:InvokeAsync",
                    "lambda:InvokeFunction",
                    "iam:GenerateCredentialReport",
                    "iam:GetAccountPasswordPolicy",
                    "iam:DeleteAccountPasswordPolicy",
                    "iam:ListSAMLProviders",
                    "iam:GetServiceLastAccessedDetailsWithEntities",
                    "iam:GenerateServiceLastAccessedDetails",
                    "iam:ListPoliciesGrantingServiceAccess",
                    "iam:GetServiceLastAccessedDetails",
                    "iam:ListVirtualMFADevices",
                    "iam:GetContextKeysForCustomPolicy",
                    "iam:SimulateCustomPolicy",
                    "iam:UpdateAccountPasswordPolicy",
                    "iam:ListOpenIDConnectProviders",
                    "iam:CreateAccountAlias",
                    "iam:ListAccountAliases",
                    "iam:GetAccountAuthorizationDetails",
                    "iam:DeleteAccountAlias",
                    "iam:GetCredentialReport",
                    "iam:GetAccountSummary"
                ],
                "Resource": "*"
            },
            {
                "Sid": "VisualEditor1",
                "Effect": "Allow",
                "Action": "iam:*",
                "Resource": "*"
            }
        ]
    }
    ```

    > Create and add this to your LambdaPolicy

    ```json
    {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "lambda:AddPermission",
            "Resource": "arn:aws:lambda:*:*:function:*"
        }
    ]
    }
    ```
- **After creating both policies, it will look something like this**

    ![picture alt](https://s3.amazonaws.com/spellbeebackend/iam.PNG
 "Title is optional")

    From here on you can work with your skill and explore the api.

- ### Working on an existing skill
    The ask clone command allows you to set up a local project from your existing skill.
    ```sh
    $ ask clone --skill-id 'amzn1.ask.skill.UUID'
    $ cd my-existing-skill-name
    # make some changes here
    $ ask deploy
    ```
    ask deploy will deploy all of your changes to skill manifest, interaction models, and AWS Lambda function(s).
