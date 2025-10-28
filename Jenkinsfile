pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
        ANSIBLE_INVENTORY = 'ansible/inventory.ini'
        PLAYBOOK = 'ansible/playbook_nodejs.yaml'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/SaulEM97/nodejs-jenkins.git',
                    credentialsId: 'github-pat'
            }
        }

        stage('Build & Test') {
            steps {
                sh '''
                echo "Installing dependencies..."
                npm install

                echo "Running tests..."
                npm test

                echo "Packing artifact..."
                mkdir -p build
                cp package.json package-lock.json index.js build/
                tar -czf node-jenkins.tar.gz -C build .
                '''
            }
        }

        stage('Deploy via Ansible') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ANSIBLE_SSH_KEY',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh """
                    ansible-playbook -i \$ANSIBLE_INVENTORY \$PLAYBOOK \
                      -u \$SSH_USER --private-key \$SSH_KEY \
                      -e "artifact=${WORKSPACE}/node-jenkins.tar.gz" \
		      -o StrictHostKeyChecking=no
                    """
                }
            }
        }
    }
}

