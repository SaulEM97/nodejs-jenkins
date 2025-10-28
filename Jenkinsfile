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
	stage('Prepare SSH Known Hosts') {
    	    steps {
        	withCredentials([
       			sshUserPrivateKey(
               			credentialsId: 'ANSIBLE_SSH_KEY',
               			keyFileVariable: 'SSH_KEY',
               			usernameVariable: 'SSH_USER'
         		)
       		]) {
       		sh """
       		mkdir -p ~/.ssh
       		chmod 700 ~/.ssh

       		# Agregar las claves de los hosts EC2 al known_hosts
       		for host in 44.206.225.202 54.211.207.6 18.212.185.61; do
             		ssh-keyscan -H \$host >> ~/.ssh/known_hosts || true
       		done

       		chmod 644 ~/.ssh/known_hosts
       		"""
      		}
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
                    """
                }
            }
        }
    }
}

